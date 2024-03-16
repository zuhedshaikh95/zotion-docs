import { Container } from "@/components";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default async function IndexRootLayout({ children }: Props) {
  return <main>{children}</main>;
}
