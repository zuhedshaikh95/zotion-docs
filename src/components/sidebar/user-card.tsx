"use server";
import db from "@/libs/supabase/db";
import { SubscriptionI } from "@/libs/supabase/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import React from "react";
import { Avatar, LogoutButton, ModeToggle } from "..";
import Image from "next/image";
import { LogOut } from "lucide-react";

interface Props {
  subscription: SubscriptionI | null;
}

const UserCard: React.FC<Props> = async ({ subscription }) => {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  const user = await db.query.users.findFirst({
    where: (dbUser, { eq }) => eq(dbUser.id, data.user.id),
  });

  if (!user) return;

  const profile = { ...user };

  profile.avatarUrl = supabase.storage.from("avatars").getPublicUrl(user.avatarUrl!).data.publicUrl;

  return (
    <article
      className="
        hidden
        sm:flex
        justify-between
        items-center
        p-2
        dark:bg-Neutrals/neutrals-12
        rounded-3xl"
    >
      <aside
        className="
          flex
          justify-center
          items-center
          gap-2"
      >
        <Avatar.Root>
          <Avatar.Image src={profile.avatarUrl} />
          <Avatar.Fallback>
            <Image src="/placeholder.jpg" fill alt="avatar" />
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="flex flex-col">
          <span className="text-muted-foreground">{subscription?.status === "active" ? "Pro Plan" : "Free Plan"}</span>
          <small
            className="
              w-[100px] 
              overflow-hidden 
              overflow-ellipsis"
          >
            {profile.email}
          </small>
        </div>
      </aside>

      <div
        className="
          flex
          justify-center
          items-center"
      >
        <LogoutButton>
          <LogOut size={"1.2rem"} />
        </LogoutButton>

        <ModeToggle />
      </div>
    </article>
  );
};

export default UserCard;
