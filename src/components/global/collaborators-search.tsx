"use client";
import { useAuth } from "@/libs/providers/auth-provider";
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input, Sheet, Scroll, Avatar, Button } from "..";
import Image from "next/image";
import { searchUsers } from "@/libs/supabase/queries";
import { UserI } from "@/libs/supabase/supabase.types";

interface Props {
  existingCollaborators: UserI[] | [];
  onGetCollaborator: (collaborator: UserI) => void;
  children: React.ReactNode;
}

const CollaboratorSearch: React.FC<Props> = ({ children, existingCollaborators, onGetCollaborator }) => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<UserI[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const response = await searchUsers(event.target.value);
      setSearchResults(response);
    }, 500);
  };

  const handleAddCollaborator = () => {};

  return (
    <Sheet.Root>
      <Sheet.Trigger className="w-full">{children}</Sheet.Trigger>
      <Sheet.Content className="w-full sm:w-[500px]">
        <Sheet.Header>
          <Sheet.Title>Search Collaborator</Sheet.Title>
          <Sheet.Description>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them from the settings tab.
            </p>
          </Sheet.Description>
        </Sheet.Header>

        <div
          className="
          flex
          justify-center
          items-center
          mt-2
          gap-2"
        >
          <Search />
          <Input className="dark:bg-background" name="name" placeholder="Email" onChange={handleSearch} />
        </div>

        <Scroll.Area
          className="
            mt-6
            overflow-y-auto
            w-full
            rounded-md"
        >
          {searchResults
            .filter((resultUser) => !existingCollaborators.some((existingUser) => existingUser.id !== resultUser.id))
            .filter((resultUser) => resultUser.id !== user?.id)
            .map((user) => (
              <div
                key={user.id}
                className="
                  p-2
                  flex
                  justify-between
                  items-center"
              >
                <div className="flex gap-3 items-center">
                  <Avatar.Root className="w-8 h-8">
                    <Avatar.Image src={user.avatarUrl!} alt="avatar" />
                    <Avatar.Fallback>
                      <Image src="/placeholder.jpg" alt="avatar-fallback" fill />
                    </Avatar.Fallback>
                  </Avatar.Root>

                  <p
                    className="
                      text-sm
                      overflow-hidden
                      overflow-ellipsis
                      w-[180px]
                      text-muted-foreground"
                  >
                    {user.email}
                  </p>
                </div>

                <Button variant="secondary" onClick={() => onGetCollaborator(user)}>
                  Add
                </Button>
              </div>
            ))}
        </Scroll.Area>
      </Sheet.Content>
    </Sheet.Root>
  );
};

export default CollaboratorSearch;
