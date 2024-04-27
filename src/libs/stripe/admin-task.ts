import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from ".";
import { customers, prices, products, subscriptions, users } from "../../../migrations/schema";
import db from "../supabase/db";
import { PriceI, ProductI, SubscriptionI } from "../supabase/supabase.types";
import { toDateTime } from "../utils";

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: ProductI = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  try {
    const response = await db
      .insert(products)
      .values(productData)
      .onConflictDoUpdate({ target: products.id, set: productData });

    console.log(`Product record updated for product [${product.id}]`);
    return { data: response, error: null };
  } catch (error: any) {
    console.log("upsertProductRecord Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: PriceI = {
    id: price.id,
    productId: typeof price.product === "string" ? price.product : null,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unitAmount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    intervalCount: price.recurring?.interval_count ?? null,
    trialPeriodDays: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  try {
    const response = await db
      .insert(prices)
      .values(priceData)
      .onConflictDoUpdate({ target: prices.id, set: priceData });

    console.log(`Price record updated for price [${price.id}]`);
    return { data: response, error: null };
  } catch (error: any) {
    console.log("upsertPriceRecord Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const createOrRetrieveCustomer = async ({ email, uuid }: { email: string; uuid: string }) => {
  try {
    const customer = await db.query.customers.findFirst({ where: (dbCustomer, { eq }) => eq(dbCustomer.id, uuid) });

    if (!customer) throw new Error("Customer not found!");

    console.log(`Customer retrieved for customer - [${customer.id}]`);
    return customer.stripeCustomerId;
  } catch (error: any) {
    if (error.message === "Customer not found!") {
      const customerData: { metadata: { supabaseUUID: string }; email?: string } = {
        metadata: {
          supabaseUUID: uuid,
        },
      };

      if (email) customerData.email = email;

      try {
        const customer = await stripe.customers.create(customerData);

        await db.insert(customers).values({ id: uuid, stripeCustomerId: customer.id });

        console.log(`New customer created and inserted for [${uuid}]!`);

        return customer.id;
      } catch (error: any) {
        throw new Error("Could not create Customer or find the customer:", error.message);
      }
    }
  }
};

export const copyBillingDetailsToCustomer = async (uuid: string, payment_method: Stripe.PaymentMethod) => {
  const customer = payment_method.customer as string;

  const { name, phone, address } = payment_method.billing_details;

  if (!name || !phone || !address) return;

  try {
    //@ts-ignore
    await stripe.customers.update(customer, { name, phone, address });

    const response = await db
      .update(users)
      .set({ billingAddress: { ...address }, paymentMethod: { ...payment_method[payment_method.type] } })
      .where(eq(users.id, uuid));

    console.log(`Customer billing details copied for customer [${uuid}]!`);
    return { data: response, error: null };
  } catch (error: any) {
    console.log("copyBillingDetailsToCustomer Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction: boolean = false
) => {
  try {
    const customerData = await db.query.customers.findFirst({
      where: (dbCustomer, { eq }) => eq(dbCustomer.stripeCustomerId, customerId),
    });

    if (!customerData) throw new Error("🔴Cannot find the customer");

    const { id: uuid } = customerData;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    console.log("🟢UPDATED to  ", subscription.status);

    const subscriptionData: SubscriptionI = {
      id: subscription.id,
      userId: uuid,
      metadata: subscription.metadata,
      //@ts-ignore
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      //@ts-ignore
      quantity: subscription.quantity,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
      canceledAt: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
      currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
      currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
      endedAt: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
      trialStart: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
      trialEnd: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
    };

    await db
      .insert(subscriptions)
      .values(subscriptionData)
      .onConflictDoUpdate({ target: subscriptions.id, set: subscriptionData });

    console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

    if (createAction && subscription.default_payment_method && uuid) {
      await copyBillingDetailsToCustomer(uuid, subscription.default_payment_method as Stripe.PaymentMethod);
    }
  } catch (error: any) {
    console.log("manageSubscriptionStatusChange Error:", error.message);
    return { data: null, error: error.message };
  }
};
