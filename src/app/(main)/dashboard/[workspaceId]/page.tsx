export const dynamic = "force-dynamic";

import { QuillEditor } from "@/components";
import { getWorkspaceDetails } from "@/libs/supabase/queries";
import { redirect } from "next/navigation";
interface PageProps {
  params: {
    workspaceId: string;
  };
}

export default async function Workspace({ params }: PageProps) {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);

  if (error || !data) redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor dirType="workspace" fileId={params.workspaceId} dirDetails={data} />
    </div>
  );
}
