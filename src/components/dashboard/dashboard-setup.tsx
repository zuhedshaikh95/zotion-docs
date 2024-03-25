"use client";
import { createNewWorkspace } from "@/libs/supabase/queries";
import { SubscriptionI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { CreateWorkspaceFormSchema } from "@/libs/validations/workspace";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { Button, Card, EmojiPicker, Input, Label, Loader } from "..";
import { useToast } from "../ui/use-toast";
import { useAppState } from "@/libs/providers/app-state-provider";

interface Props {
  user: AuthUser | null;
  subscription: SubscriptionI | null;
}

const DashboardSetup: React.FC<Props> = ({ subscription, user }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { dispatch } = useAppState();
  const supabase = createClientComponentClient();
  const [selectedEmoji, setSelectedEmoji] = useState<string>("💼");

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isSubmitting: isLoading },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateWorkspaceFormSchema>> = async (values) => {
    const [file] = values.logo;
    let filePath = null;
    const workspaceUUID = uuidv4();

    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspace-logo-${workspaceUUID}`, file, {
            upsert: true,
          });

        if (error) throw new Error(error.message);
        filePath = data.path;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Logo Upload Error",
          description: error.message,
        });
        return;
      }
    }

    try {
      const newWorkspace: WorkspaceI = {
        bannerUrl: "",
        createdAt: new Date().toISOString(),
        data: null,
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: "",
        logo: filePath ?? null,
        workspaceOwner: user?.id!,
        title: values.workspaceName,
      };
      const { data, error: createError } = await createNewWorkspace(newWorkspace);

      if (createError) {
        toast({
          variant: "destructive",
          title: "Workspace Create Error",
          description: createError,
        });
        return;
      }

      dispatch({
        type: "ADD_WORKSPACE",
        payload: { ...newWorkspace, folders: [] },
      });

      toast({
        title: "Successful",
        description: `${values.workspaceName} has been created!`,
      });

      router.replace(`/dashboard/${workspaceUUID}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logo Upload Error",
        description: error.message,
      });
      return;
    } finally {
      resetForm();
    }
  };

  return (
    <Card.Root
      className="
        w-full
        h-screen
        sm:max-w-[800px]
        sm:h-auto
        p-4"
    >
      <Card.Header>
        <Card.Title>Create a Workspace</Card.Title>
        <Card.Description>
          Lets create a private workspace to get you started.You can add collaborators later from the workspace settings
          tab.
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div
              className="
                flex
                items-center
                gap-4"
            >
              <div className="text-5xl">
                <EmojiPicker onEmojiClick={(emoji) => setSelectedEmoji(emoji.emoji)}>{selectedEmoji}</EmojiPicker>
              </div>

              <div className="w-full">
                <Label
                  htmlFor="workspaceName"
                  className="
                    text-sm
                    text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">{errors?.workspaceName?.message?.toString()}</small>
              </div>
            </div>

            <div>
              <Label
                htmlFor="logo"
                className="
                  text-sm
                  text-muted-foreground"
              >
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Name"
                // disabled={isLoading || subscription?.status !== "active"}
                {...register("logo", { required: false })}
              />
              <small className="text-red-600">{errors?.logo?.message?.toString()}</small>

              {subscription?.status !== "active" && (
                <small
                  className="
                  text-muted-foreground
                  block
              "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>

            <Button className="self-end" disabled={isLoading} type="submit">
              {!isLoading ? "Create Workspace" : <Loader />}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
  );
};

export default DashboardSetup;
