"use client";
import { useAuth } from "@/libs/providers/auth-provider";
import { addCollaborators, createNewWorkspace } from "@/libs/supabase/queries";
import { UserI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { Lock, Plus, Share } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Avatar, Button, CollaboratorSearch, Input, Label, Loader, Scroll, Select } from "..";
import { useToast } from "../ui/use-toast";

interface Props {}

const WorkspaceCreator: React.FC<Props> = ({}) => {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<UserI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addCollaborator = (user: UserI) => {
    setCollaborators((prevCollaborators) => [...prevCollaborators, user]);
  };

  const removeCollaborator = (user: UserI) => {
    setCollaborators(collaborators.filter((collaborator) => collaborator.id !== user.id));
  };

  const handleCreateWorkspace = async () => {
    setIsLoading(true);
    const uuid = uuidv4();

    if (user?.id) {
      const newWorkspace: WorkspaceI = {
        bannerUrl: null,
        createdAt: new Date().toISOString(),
        data: null,
        iconId: "💼",
        id: uuid,
        inTrash: null,
        title,
        workspaceOwner: user.id,
        logo: null,
      };

      if (permissions === "private") {
        try {
          await createNewWorkspace(newWorkspace);
          router.refresh();
          toast({
            variant: "default",
            title: "Workspace Created",
            description: "New Private workspace has been created successfully!",
          });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Workspace Create Error",
            description: error.message,
          });
          console.log("Workspace Create Error:", error.message);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (permissions === "shared") {
        try {
          await createNewWorkspace(newWorkspace);
          await addCollaborators(collaborators, uuid);
          router.refresh();
          toast({
            variant: "default",
            title: "Workspace Created",
            description: "New Shared workspace has been created!",
          });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Workspace Create Error",
            description: error.message,
          });
          console.log("Workspace Create Error:", error.message);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="">
        <Label className="text-sm text-muted-foreground" htmlFor="name">
          Name
        </Label>

        <div className="flex justify-center items-center gap-2">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
      </div>
      <>
        <Label className="text-sm text-muted-foreground" htmlFor="permissions">
          Permissions
        </Label>

        <Select.Root onValueChange={(value) => setPermissions(value)} defaultValue={permissions}>
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
      </>

      {permissions === "shared" && (
        <div>
          <CollaboratorSearch existingCollaborators={collaborators} onGetCollaborator={(user) => addCollaborator(user)}>
            <Button type="button" className="text-sm mt-4">
              <Plus /> Add Collaborators
            </Button>
          </CollaboratorSearch>

          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Collaborators {collaborators.length || ""}</span>

            <Scroll.Area
              className="
                h-[120px]
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

                    <Button variant="secondary" onClick={() => removeCollaborator(collaborator)}>
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

      <Button
        type="button"
        variant="secondary"
        disabled={!title || (permissions === "shared" && collaborators.length === 0) || isLoading}
        onClick={handleCreateWorkspace}
      >
        {!isLoading ? <Loader /> : "Create"}
      </Button>
    </div>
  );
};

export default WorkspaceCreator;
