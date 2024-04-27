"use client";
import { useAuth } from "@/libs/providers/auth-provider";
import { useSubscriptionModal } from "@/libs/providers/subscription-modal-provider";
import { getStripe } from "@/libs/stripe/stripe-client";
import { PriceI, ProductWithPriceI } from "@/libs/supabase/supabase.types";
import { formatPrice, postData } from "@/libs/utils";
import React, { useState } from "react";
import { Button, Dialog, Loader } from "..";
import { useToast } from "../ui/use-toast";

interface Props {
  products?: ProductWithPriceI[];
}

const SubscriptionModal: React.FC<Props> = ({ products }) => {
  const { open, setOpen } = useSubscriptionModal();
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOpenBillingPortal = async (price: PriceI) => {
    setIsLoading(true);

    try {
      setIsLoading(true);

      if (!user) {
        toast({ title: "You must be logged in" });
        setIsLoading(false);
        return;
      }

      if (subscription) {
        toast({ title: "Already on a paid plan" });
        setIsLoading(false);
        return;
      }

      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price, origin: window.location.origin },
      });

      console.log("Getting Checkout for stripe");
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast({ title: "Opps! Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

          {products?.length
            ? products.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  {product.prices?.map((price) => (
                    <React.Fragment key={price.id}>
                      <b className="text-3xl text-foreground">
                        {formatPrice(price)} / <small>{price.interval}</small>
                      </b>

                      <Button disabled={isLoading} onClick={handleOpenBillingPortal.bind(null, price)}>
                        {isLoading ? <Loader /> : "Upgrade ✨"}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              ))
            : "No Products available"}
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default SubscriptionModal;
