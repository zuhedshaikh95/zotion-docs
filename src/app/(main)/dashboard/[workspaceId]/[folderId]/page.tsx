export const dynamic = "force-dynamic";

import { QuillEditor } from "@/components";
import { getFolderDetails } from "@/libs/supabase/queries";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    folderId: string;
  };
}

export default async function Folder({ params }: PageProps) {
  const { data, error } = await getFolderDetails(params.folderId);

  if (error || !data) redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor dirType="folder" fileId={params.folderId} dirDetails={data} />
    </div>
  );
}
