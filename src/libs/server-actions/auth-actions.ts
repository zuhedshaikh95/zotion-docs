"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import * as z from "zod";
import { loginFormSchema } from "../validations/login";

export async function authUserLogin({ email, password }: z.infer<typeof loginFormSchema>) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const response = await supabase.auth.signInWithPassword({ email, password });

    if (response.error) {
      return { error: { message: response.error.message, status: response.error.status } };
    }

    return response;
  } catch (error: any) {
    console.log("Auth Login Error:", error.message);
    return null;
  }
}
