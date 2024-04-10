import { FileI, FolderI, WorkspaceI } from "@/libs/supabase/supabase.types";
import React from "react";
import CustomDialogTrigger from "../global/custom-dialogue-trigger";
import BannerUploadForm from "./banner-upload-form";

interface Props {
  children: React.ReactNode;
  className?: string;
  dirType: "workspace" | "folder" | "file";
  id: string;
  details: WorkspaceI | FolderI | FileI;
}

const BannerUpload: React.FC<Props> = ({ children, details, dirType, id, className }) => {
  return (
    <CustomDialogTrigger
      className={className}
      header="Upload Banner"
      content={<BannerUploadForm details={details} dirType={dirType} id={id} />}
    >
      {children}
    </CustomDialogTrigger>
  );
};

export default BannerUpload;
