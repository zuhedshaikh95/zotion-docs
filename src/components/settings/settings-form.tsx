"use client";
import React, { useRef, useState } from "react";
import { useAppState } from "@/libs/providers/app-state-provider";
import { useToast } from "../ui/use-toast";
import { UserI } from "@/libs/supabase/supabase.types";
import { useAuth } from "@/libs/providers/auth-provider";
import { useRouter } from "next/navigation";

interface Props {}

const SettingsForm: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { state, workspaceId, dispatch } = useAppState();
  const [permission, setPermission] = useState<string>("Private");
  const [collaborators, setCollaborators] = useState<UserI[]>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState<boolean>(false);
  const [workspaceDetails, setWorkspaceDetails] = useState();
  const [uploadingProfilePic, setUploadingProfilePic] = useState<boolean>(false);

  return <div>SettingsForm</div>;
};

export default SettingsForm;
