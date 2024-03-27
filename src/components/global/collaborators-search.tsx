"use client";
import { CollaboratorI } from "@/libs/supabase/supabase.types";
import { User } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";

interface Props {
  existingCollaborators: User[] | [];
  onGetCollaborator: (collaborator: CollaboratorI) => void;
  children: React.ReactNode;
}

const CollaboratorSearch: React.FC<Props> = ({ children, existingCollaborators, onGetCollaborator }) => {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return <div>CollaboratorSearch</div>;
};

export default CollaboratorSearch;
