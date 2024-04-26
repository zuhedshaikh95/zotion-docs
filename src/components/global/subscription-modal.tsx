"use client";
import { useSubscriptionModal } from "@/libs/providers/subscription-modal-provider";
import React, { useState } from "react";
import { Button, Dialog, Loader } from "..";
import { useAuth } from "@/libs/providers/auth-provider";
import { formatPrice } from "@/libs/utils";

interface Props {}

const SubscriptionModal: React.FC<Props> = ({}) => {
  const { open, setOpen } = useSubscriptionModal();
  const { subscription } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {subscription?.status === "active" ? (
        <Dialog.Content>Already on a paid plan!</Dialog.Content>
      ) : (
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Upgrade to Pro plan</Dialog.Title>
          </Dialog.Header>
          <Dialog.Description>To access Pro features you need to have a paid plan.</Dialog.Description>
          {/* <div className="flex justify-between items-center"> */}
          {/* <strong className="text-3xl text-foreground"> */}
          {/* {formatPrice(12.99)} */}
          {/* $12.99 /<small>month</small> */}
          {/* </strong> */}
          {/* <Button disabled={isLoading}>{isLoading ? <Loader /> : "Upgrade ✨"}</Button> */}
          {/* </div> */}
          No Products available
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default SubscriptionModal;
