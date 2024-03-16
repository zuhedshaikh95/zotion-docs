"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<Props> = ({ children, className }) => {
  return <section className={twMerge("max-w-[2520px] mx-auto md:px-10 sm:px-2 px-4", className)}>{children}</section>;
};

export default Container;
