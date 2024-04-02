"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function File() {
  const { fileId } = useParams();
  return <div>{fileId}</div>;
}
