import { DashboardSetup } from "@/components";
import db from "@/libs/supabase/db";
import { getUserSubscription } from "@/libs/supabase/queries";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashbaord() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } = await getUserSubscription(user.id);

  // if (subscriptionError) return <p>{subscriptionError}</p>;

  if (!workspace) {
    return (
      <section
        className="
          p-4
          bg-background
          h-screen
          w-screen
          flex
          justify-center
          items-center"
      >
        <DashboardSetup user={user} subscription={subscription} />
      </section>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
}
