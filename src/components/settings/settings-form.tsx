"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { useAuth } from "@/libs/providers/auth-provider";
import {
  addCollaborators,
  deleteWorkspace,
  getCollaborators,
  removeCollaborators,
  updateWorkspace,
} from "@/libs/supabase/queries";
import { UserI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Briefcase, CreditCard, Lock, LogOut, Plus, Share, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertDialog,
  Avatar,
  Button,
  CollaboratorSearch,
  Input,
  Label,
  LogoutButton,
  Scroll,
  Select,
  Separator,
} from "..";
import { useToast } from "../ui/use-toast";

interface Props {}

const SettingsForm: React.FC<Props> = ({}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { user, subscription } = useAuth();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { state, workspaceId, dispatch } = useAppState();
  const [permissions, setPermissions] = useState<string>("Private");
  const [collaborators, setCollaborators] = useState<UserI[]>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState<boolean>(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<WorkspaceI | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);

  // get workspace details
  useEffect(() => {
    const showingWorkspace = state.workspaces.find((workspace) => workspace.id === workspaceId);

    if (showingWorkspace) setWorkspaceDetails(showingWorkspace);
  }, [workspaceId, state]);

  // get all collaborators
  useEffect(() => {
    if (!workspaceId) return;

    (async () => {
      const { data, error } = await getCollaborators(workspaceId);

      if (data?.length) {
        setPermissions("shared");
        setCollaborators(data);
      }
    })();
  }, [workspaceId]);

  // payment portal
  // add collaborators
  const handleAddCollaborator = async (user: UserI) => {
    if (!workspaceId) return;

    const { error } = await addCollaborators([user], workspaceId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Add Collaborators Error",
        description: error,
      });
      return;
    }

    setCollaborators((prevCollaborators) => [...prevCollaborators, user]);
  };

  // remove collaborators
  const handleRemoveCollaborator = async (user: UserI) => {
    if (!workspaceId) return;

    if (collaborators.length === 1) {
      setPermissions("Private");
    }

    const { error } = await removeCollaborators([user], workspaceId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Remove Collaborators Error",
        description: error,
      });
      return;
    }

    setCollaborators(collaborators.filter((collaborator) => collaborator.id !== user.id));
  };

  // onchange
  const handleWorkspaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !event.target.value) return;

    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: { workspace: { title: event.target.value }, workspaceId },
    });

    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);

    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: event.target.value }, workspaceId);

      router.refresh();
    }, 500);
  };

  const handleWorkspaceLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;

    setUploadingLogo(true);
    const file = event.target.files?.[0];

    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspace-logo-${workspaceId}`, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (!error) {
          const response = await updateWorkspace({ logo: data.path }, workspaceId);

          if (response.error) {
            toast({
              variant: "destructive",
              title: "Workspace Update Error",
              description: response.error,
            });
            return;
          }

          dispatch({
            type: "UPDATE_WORKSPACE",
            payload: { workspace: { logo: data.path }, workspaceId },
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Workspace Logo Error",
          description: error.message,
        });
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const handlePermissionOnChange = async (value: string) => {
    if (value === "private" && collaborators.length) {
      setOpenAlertMessage(true);
      return;
    }
    setPermissions(value);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

  // onclicks
  const handleDeleteWorkspace = async () => {
    if (!workspaceId) return;

    const { error } = await deleteWorkspace(workspaceId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Delete Workspace Error",
        description: error,
      });
      return;
    }

    dispatch({
      type: "DELETE_WORKSPACE",
      payload: workspaceId,
    });

    toast({
      title: "Workspace Deleted!",
      description: "Successfully deleted workspace!",
    });

    router.replace("/dashboard");
  };

  const handleAlertDialogClick = async () => {
    if (!workspaceId) return;

    if (collaborators.length) {
      await removeCollaborators(collaborators, workspaceId);
    }
    setPermissions("private");
    setOpenAlertMessage(false);
  };

  // fetching avatar details

  // payment portal redirect

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-6 mt-6">
        <Briefcase size={20} />
      </p>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-muted-foreground" htmlFor="workspaceName">
          Name
        </Label>
        <Input
          name="workspaceName"
          placeholder="Workspace Name"
          value={workspaceDetails?.title || ""}
          onChange={handleWorkspaceNameChange}
        />

        <Label className="text-sm text-muted-foreground" htmlFor="workspaceLogo">
          Workspace Logo
        </Label>
        <Input
          type="file"
          name="workspaceLogo"
          placeholder="Workspace Logo"
          accept="image/*"
          onChange={handleWorkspaceLogoChange}
          disabled={uploadingLogo}
        />
      </div>

      <>
        <Label className="text-sm text-muted-foreground" htmlFor="permissions">
          Permissions
        </Label>
        <Select.Root onValueChange={handlePermissionOnChange} value={permissions}>
          <Select.Trigger className="w-full h-24 -mt-3">
            <Select.Value />
          </Select.Trigger>

          <Select.Content>
            <Select.Group>
              <Select.Item value="private">
                <div
                  className="
                    p-2
                    flex
                    gap-4
                    justify-center
                    items-center"
                >
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>Your workspace is private to you. You can choose to share it later.</p>
                  </article>
                </div>
              </Select.Item>

              <Select.Item value="shared">
                <div
                  className="
                    p-2
                    flex
                    gap-4
                    justify-center
                    items-center"
                >
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <p>You can invite collaborators.</p>
                  </article>
                </div>
              </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>

        {permissions === "shared" && (
          <div>
            <CollaboratorSearch
              existingCollaborators={collaborators}
              onGetCollaborator={(user) => handleAddCollaborator(user)}
            >
              <Button type="button" className="text-sm mt-4">
                <Plus /> Add Collaborators
              </Button>
            </CollaboratorSearch>

            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Collaborators {collaborators.length || ""}</span>

              <Scroll.Area
                className="
                h-32
                overflow-y-auto
                w-full
                rounded-md
                border
                border-muted-foreground/20"
              >
                {!!collaborators.length ? (
                  collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="p-4 flex justify-between items-center">
                      <div className="flex gap-4 w-full items-center">
                        <Avatar.Root>
                          <Avatar.Image src={"/avatar/7.png"} alt="avatar" />
                          <Avatar.Fallback>
                            <Image src="/placeholder.jpg" alt="avatar-fallback" fill />
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                      </div>

                      <Button variant="secondary" onClick={() => handleRemoveCollaborator(collaborator)}>
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div
                    className="
                    absolute
                    inset-0
                    flex
                    justify-center
                    items-center"
                  >
                    <span className="text-muted-foreground text-sm">You have no collaborators</span>
                  </div>
                )}
              </Scroll.Area>
            </div>
          </div>
        )}

        <Alert.Root variant="destructive">
          <Alert.Description>
            Warning! deleting you workspace will permanantly delete all data related to this workspace.
          </Alert.Description>

          <Button
            className="
              mt-4
              text-sm
              bg-destructive/40
              border-2
              border-destructive"
            type="submit"
            size="sm"
            variant="destructive"
            onClick={handleDeleteWorkspace}
          >
            Delete Workspace
          </Button>
        </Alert.Root>
        <p className="flex items-center gap-2 mt-6">
          <User size={20} />
        </p>

        <Separator />

        <div className="flex items-center">
          <Avatar.Root>
            <Avatar.Image src="" alt="avatar-image" />
            <Avatar.Fallback>
              <Image src="/placeholder.jpg" fill alt="avatar" />
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="flex flex-col ml-6">
            <small className="text-muted-foreground cursor-not-allowed">{user?.email}</small>

            <Label htmlFor="profile-picture" className="text-sm text-muted-foreground">
              Profile picture
            </Label>

            <Input
              name="profile-picture"
              type="file"
              accept="image/*"
              placeholder="Profile picture"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>

        <LogoutButton>
          <div className="flex items-center">
            <LogOut />
          </div>
        </LogoutButton>

        <p className="flex items-center gap-2 mt-6">
          <CreditCard size={20} /> Billing & Plan
        </p>

        <Separator />

        <p className="text-muted-foreground">
          You are currently on a {subscription?.status === "active" ? "Pro" : "Free"} plan
        </p>
      </>

      <AlertDialog.Root open={openAlertMessage}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              Changing a shared workspace to a Private workspace will remove all collaborators permanently.
            </AlertDialog.Description>
          </AlertDialog.Header>

          <AlertDialog.Footer>
            <AlertDialog.Cancel onClick={() => setOpenAlertMessage(false)}>Cancel</AlertDialog.Cancel>

            <AlertDialog.Action onClick={handleAlertDialogClick}>Continue</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default SettingsForm;
