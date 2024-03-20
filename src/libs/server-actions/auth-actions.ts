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
    return { error: { message: error.message } };
  }
}

export async function authUserSignup({ email, password }: z.infer<typeof loginFormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("email", email);

    if (data?.length) {
      return { error: { message: "Account with this email ID already exists!", data } };
    }

    const response = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    });

    return response;
  } catch (error: any) {
    console.log("Auth Signup Error:", error.message);
    return { error: { message: error.message } };
  }
}
