"use client";
import { Container, Form, Input } from "@/components";
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

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (values) => {};

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
          onChange={() => {
            if (submitError) setSubmitError("");
          }}
        >
          <Link
            className="
                w-full
                flex
                items-center"
            href="/"
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
              </Form.Item>
            )}
          />
        </form>
      </Form.Root>
    </Container>
  );
}
