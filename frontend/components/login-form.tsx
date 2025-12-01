"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMessage";
import { ErrorContext } from "@/store/ErrorStore";
import { ur } from "zod/v4/locales";

interface FormState {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setError } = useContext(ErrorContext);
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [formState, setFormState] = useState<FormState>({
    username: "",
    password: "",
  });

  const onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;

    setFormState((formState) => ({
      ...formState,
      [id]: value,
    }));
  };

  const onClick = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const url = new URL("/auth/login", process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        login!(data.data, data.accessToken);

        router.push("/dashboard");
      } else throw new Error("Login failed");
    } catch {
      setError("Could not login with provided credentials.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ErrorMessage withTimer />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="username"
                  type="username"
                  placeholder="user_name"
                  required
                  onChange={onChange}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={onChange}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" onClick={onClick}>
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
