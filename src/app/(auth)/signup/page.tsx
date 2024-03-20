"use client";
import { Alert, Button, Form, Input, Loader } from "@/components";
import { signupFormSchema } from "@/libs/validations/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signupFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(signupFormSchema),
    defaultValues: { confirmPassword: "", email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return "";
    return searchParams.get("error_descrition");
  }, [searchParams]);

  const confirmationAndErrorStyles = useMemo<string>(
    () =>
      clsx("bg-primary", {
        "bg-red-500/10": !!codeExchangeError,
        "border-red-500/50": !!codeExchangeError,
        "text-red-700": !!codeExchangeError,
      }),
    []
  );

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = async (values) => {};

  return (
    <Form.Root {...form}>
      <form
        className="
            w-full
            sm:justify-center
            sm:w-[400px]
            space-y-6
            flex
            flex-col"
        onChange={() => (!!submitError ? setSubmitError("") : null)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Link
          href="/"
          className="
                w-full
                flex
                items-center"
          passHref
        >
          <Image src="/zotion-logo.png" alt="zotion-logo" width={50} height={50} />
          <span className="font-semibold dark:text-white text-4xl ml-2">Zotion</span>
        </Link>

        <Form.Description className="text-foreground/60">
          All-in-one Collaboration and Productivity Platform
        </Form.Description>

        <Form.Field
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <Input type="email" placeholder="Email" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <Input type="password" placeholder="Password" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          disabled={isLoading}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <Form.Item>
              <Form.Control>
                <Input type="password" placeholder="Confim Password" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        {submitError && <Form.Message>{submitError}</Form.Message>}

        {!confirmation && !codeExchangeError && (
          <>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {!isLoading ? "Create Account" : <Loader />}
            </Button>
          </>
        )}

        <span className="self-container">
          Already have an account?{" "}
          <Link href="/login" className="text-primary" passHref>
            Login
          </Link>
        </span>

        {(confirmation || codeExchangeError) && (
          <>
            <Alert.Root className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className="h-4 w-4" />}
              <Alert.Title>{codeExchangeError ? "Invalid Link" : "Check your email"}</Alert.Title>
              <Alert.Description>{codeExchangeError || "We have sent you a magic link!"}</Alert.Description>
            </Alert.Root>
          </>
        )}
      </form>
    </Form.Root>
  );
}
