"use client";
import { Button, Container, Form, Input, Loader } from "@/components";
import { authUserLogin } from "@/libs/server-actions/auth-actions";
import { loginFormSchema } from "@/libs/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

export default function Login() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");

  const form = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(loginFormSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (values) => {
    try {
      const response = await authUserLogin(values);

      if (response?.error) {
        form.reset();
        setSubmitError(response.error.message);
        return;
      }

      router.replace("/dashboard");
    } catch (error: any) {
      console.log("Login Error:", error.message);
    }
  };

  return (
    <Container>
      <Form.Root {...form}>
        <form
          className="
            w-full
            sm:w-[400px]
            space-y-6
            flex
            flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => (!!submitError ? setSubmitError("") : null)}
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

          {submitError && <Form.Message>{submitError}</Form.Message>}

          <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
            {!isLoading ? "Login" : <Loader />}
          </Button>

          <span className="self-container">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary" passHref>
              Sign Up
            </Link>
          </span>
        </form>
      </Form.Root>
    </Container>
  );
}
