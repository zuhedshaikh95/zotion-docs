"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import * as z from "zod";
import { LoginFormSchema } from "../validations/login";

export async function authUserLogin({ email, password }: z.infer<typeof LoginFormSchema>) {
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

export async function authUserSignup({ email, password }: z.infer<typeof LoginFormSchema>) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const response = await supabase.from("profiles").select("*").eq(email, "email");

    if (response.data?.length) {
      return { error: { message: "Account with email ID already exists." } };
    }

    const signup = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback` },
    });

    if (signup.error) {
      if (signup.error.message === "Email rate limit exceeded")
        return { error: { message: "Something went wrong! Try again later", name: "email-rate-limit" } };
      return { error: { message: signup.error.message } };
    }

    return signup;
  } catch (error: any) {
    console.log("Auth Signup Error:", error.message);
    return { error: { message: error.message } };
  }
}

/*
  {
    "data": {
        "user": {
            "id": "7dc241f4-3c36-48d2-ab58-fd212a8c5f77",
            "aud": "authenticated",
            "role": "",
            "email": "zuhed95@gmail.com",
            "phone": "",
            "confirmation_sent_at": "2024-03-21T17:14:54.040538946Z",
            "app_metadata": {
                "provider": "email",
                "providers": [
                    "email"
                ]
            },
            "user_metadata": {},
            "identities": [],
            "created_at": "2024-03-21T17:14:54.040538946Z",
            "updated_at": "2024-03-21T17:14:54.040538946Z",
            "is_anonymous": false
        },
        "session": null
    },
    "error": null
}
*/
