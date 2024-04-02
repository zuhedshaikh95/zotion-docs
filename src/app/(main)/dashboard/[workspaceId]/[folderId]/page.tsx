"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function Folder() {
  const { folderId } = useParams();

  return <div>{folderId}</div>;
}
