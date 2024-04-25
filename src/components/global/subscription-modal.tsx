import { useSubscriptionModal } from "@/libs/providers/subscription-modal-provider";
import React from "react";
import { Dialog } from "..";

interface Props {}

const SubscriptionModal: React.FC<Props> = ({}) => {
  const { open, setOpen } = useSubscriptionModal();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content></Dialog.Content>
    </Dialog.Root>
  );
};

export default SubscriptionModal;
