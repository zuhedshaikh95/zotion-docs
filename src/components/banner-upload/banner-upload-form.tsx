"use client";
import { Button, Input, Label, Loader } from "@/components";
import { useAppState } from "@/libs/providers/app-state-provider";
import { FileI, FolderI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { BannerUploadSchema } from "@/libs/validations/banner-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { updateFile, updateFolder, updateWorkspace } from "@/libs/supabase/queries";
import { useToast } from "../ui/use-toast";

interface Props {
  dirType: "workspace" | "folder" | "file";
  id: string;
}

const BannerUploadForm: React.FC<Props> = ({ dirType, id }) => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { state, workspaceId, folderId, dispatch } = useAppState();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof BannerUploadSchema>>({
    defaultValues: { bannerUrl: null },
    resolver: zodResolver(BannerUploadSchema),
    mode: "onChange",
  });

  const uploadBanner = async (file: any) => {
    try {
      const { error, data } = await supabase.storage
        .from("banners")
        .upload(`banner-${id}`, file, { cacheControl: "0", upsert: true });

      if (error) {
        return { data, error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      console.log("uploadBanner Error:", error.message);
      return { data: null, error: error.message };
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof BannerUploadSchema>> = async (values) => {
    const [file] = values.bannerUrl;

    if (!file || !id) return;

    try {
      await supabase.storage.from("banners").remove([`banner-${id}`]);

      const { error, data } = await uploadBanner(file);

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Banner Upload Error",
          description: error,
        });
        return;
      }

      if (dirType === "file") {
        if (!folderId || !workspaceId) return;
        await updateFile({ bannerUrl: data.path }, id);

        dispatch({
          type: "UPDATE_FILE",
          payload: { file: { bannerUrl: data.path }, fileId: id, folderId, workspaceId },
        });
      }

      if (dirType === "folder") {
        if (!workspaceId) return;
        await updateFolder({ bannerUrl: data.path }, id);

        dispatch({
          type: "UPDATE_FOLDER",
          payload: { folder: { bannerUrl: data.path }, folderId: id, workspaceId },
        });
      }

      if (dirType === "workspace") {
        if (!workspaceId) return;
        await updateWorkspace({ bannerUrl: data.path }, id);

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: { workspace: { bannerUrl: data.path }, workspaceId },
        });
      }
    } catch (error: any) {
      console.log("Banner Upload Error:", error.message);
    } finally {
      resetForm();
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Label className="text-sm text-muted-foreground" htmlFor="bannerUrl">
        Banner Image
      </Label>

      <Input
        id="bannerUrl"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register("bannerUrl", { required: "Banner image is required" })}
      />

      <small className="text-red-600">{errors.bannerUrl?.message?.toString()}</small>

      <Button disabled={isUploading} type="submit">
        {isUploading ? <Loader /> : "Upload Banner"}
      </Button>
    </form>
  );
};

export default BannerUploadForm;
