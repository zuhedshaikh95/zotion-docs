import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthTemplate({ children }: Props) {
  return <div className="h-screen pt-6 flex justify-center sm:items-center">{children}</div>;
}
