import React from "react";
import { Dialog } from "..";
import clsx from "clsx";

interface Props {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

const CustomDialogTrigger: React.FC<Props> = ({ children, className, content, description, header }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={clsx("", className)}>{children}</Dialog.Trigger>
      <Dialog.Content
        className="
            h-screen
            block
            sm:h-[440px]
            w-full"
      >
        <Dialog.Header>
          <Dialog.Title>{header}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        {content}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CustomDialogTrigger;
