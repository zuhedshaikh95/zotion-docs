"use client";
import { useParams } from "next/navigation";

export default function Workspace() {
  const { workspaceId } = useParams();

  return <div>{workspaceId}</div>;
}
