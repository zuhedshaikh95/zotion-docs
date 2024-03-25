import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code!);

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (error: any) {
    return NextResponse.json({ message: error.message, error: true, success: false }, { status: 500 });
  }
}
