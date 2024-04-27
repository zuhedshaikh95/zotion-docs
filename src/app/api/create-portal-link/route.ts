import { stripe } from "@/libs/stripe";
import { createOrRetrieveCustomer } from "@/libs/stripe/admin-task";
import { CustomException } from "@/libs/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { origin } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ url: null, error: "Invalid user session!" }, { status: 401 });

    const customer = await createOrRetrieveCustomer({
      email: user?.email ?? "",
      uuid: user?.id ?? "",
    });

    if (!customer) throw new CustomException("Something went wrong retrieving customer", 500);

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, url: null }, { status: error?.status ?? 500 });
  }
}
