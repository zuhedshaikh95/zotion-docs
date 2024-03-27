"use client";
import { useAuth } from "@/libs/providers/auth-provider";
import { addCollaborators, createNewWorkspace } from "@/libs/supabase/queries";
import { WorkspaceI } from "@/libs/supabase/supabase.types";
import { User } from "@supabase/supabase-js";
import { Lock, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, CollaboratorSearch, Input, Label, Select } from "..";
import { useToast } from "../ui/use-toast";

interface Props {}

const WorkspaceCreator: React.FC<Props> = ({}) => {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);

  const addCollaborator = (user: User) => {
    setCollaborators((prevCollaborators) => [...prevCollaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((collaborator) => collaborator.id !== user.id));
  };

  const handleCreateItem = async () => {
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
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Workspace Create Error",
            description: error.message,
          });
          console.log("Workspace Create Error:", error.message);
        }
        return;
      }

      if (permissions === "shared") {
        try {
          await createNewWorkspace(newWorkspace);
          await addCollaborators(collaborators, uuid);
          router.refresh();
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Workspace Create Error",
            description: error.message,
          });
          console.log("Workspace Create Error:", error.message);
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
          <CollaboratorSearch></CollaboratorSearch>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        disabled={!title || (permissions === "shared" && collaborators.length === 0)}
        onClick={handleCreateItem}
      >
        Create
      </Button>
    </div>
  );
};

export default WorkspaceCreator;
