export const dynamic = "force-dynamic";

import { QuillEditor } from "@/components";
import { getFileDetails } from "@/libs/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function File({ params }: PageProps) {
  const { data, error } = await getFileDetails(params.fileId);

  if (error || !data) redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor dirDetails={data} dirType="file" fileId={params.fileId} />
    </div>
  );
}
