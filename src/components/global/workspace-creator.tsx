"use client";
import { useAuth } from "@/libs/providers/auth-provider";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input, Label } from "..";

interface Props {}

const WorkspaceCreator: React.FC<Props> = ({}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);

  const addCollaborator = (user: User) => {
    setCollaborators((prevCollaborators) => [...prevCollaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((collaborator) => collaborator.id !== user.id));
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
      </>
    </div>
  );
};

export default WorkspaceCreator;
