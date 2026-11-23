
"use client";

import { Icons } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type LoginMethod = "email" | "phone";

const SignInPage = () => {
    const router = useRouter();
    const { isLoaded, signIn, setActive } = useSignIn();

    const [loginMethod, setLoginMethod] =
        useState<LoginMethod>("email");

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!isLoaded || !signIn) {
            toast.error("Authentication is not ready. Please try again.");
            return;
        }

        const identifier =
            loginMethod === "email"
                ? email.trim()
                : `+91${phoneNumber}`;

        if (loginMethod === "email" && !email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        if (
            loginMethod === "phone" &&
            !/^\d{10}$/.test(phoneNumber)
        ) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!password) {
            toast.error("Please enter your password.");
            return;
        }

        setIsLoading(true);

        try {
            const signInAttempt = await signIn.create({
                identifier,
                password,
            });

            if (signInAttempt.status === "complete") {
                if (!signInAttempt.createdSessionId) {
                    throw new Error("Session could not be created.");
                }

                await setActive({
                    session: signInAttempt.createdSessionId,
                });

                toast.success("Welcome back!");
                router.replace("/dashboard");
                return;
            }

            console.log("Incomplete sign-in:", signInAttempt);
            console.log("Status:", signInAttempt.status);
            console.log(
                "Supported factors:",
                signInAttempt.supportedSecondFactors
            );

            toast.error(
                "Additional verification is required. Please complete verification."
            );

        } catch (error: unknown) {
            console.error("Sign-in error:", error);

            const clerkError = error as {
                errors?: Array<{
                    code?: string;
                    message?: string;
                }>;
            };

            const errorCode = clerkError.errors?.[0]?.code;

            switch (errorCode) {
                case "form_identifier_not_found":
                    toast.error("Account not found. Please sign up first.");
                    break;

                case "form_password_incorrect":
                    toast.error("Incorrect password. Please try again.");
                    break;

                case "too_many_attempts":
                    toast.error("Too many attempts. Please try again later.");
                    break;

                case "form_identifier_invalid":
                    toast.error("Please enter a valid email or phone number.");
                    break;

                default:
                    toast.error(
                        clerkError.errors?.[0]?.message ||
                        "An error occurred. Please try again."
                    );
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-y-6 px-4">

            <div className="flex flex-col text-center gap-1">
                <Link href="/">
                    <Icons.logo className="w-12 h-12 mx-auto" />
                </Link>

                <h1 className="text-2xl font-bold font-heading mt-2">
                    Sign In
                </h1>

                <p className="text-muted-foreground">
                    Welcome back! Sign in to your account.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xs"
            >
                <div className="mt-4 space-y-2">
                    <Label>Sign in using</Label>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant={
                                loginMethod === "email"
                                    ? "default"
                                    : "outline"
                            }
                            disabled={isLoading}
                            onClick={() => setLoginMethod("email")}
                        >
                            Email
                        </Button>

                        <Button
                            type="button"
                            variant={
                                loginMethod === "phone"
                                    ? "default"
                                    : "outline"
                            }
                            disabled={isLoading}
                            onClick={() => setLoginMethod("phone")}
                        >
                            Phone Number
                        </Button>
                    </div>
                </div>

                {loginMethod === "email" ? (
                    <div className="mt-4 space-y-1">
                        <Label htmlFor="email">
                            Email address
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            disabled={isLoading}
                            autoComplete="email"
                            required
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>
                ) : (
                    <div className="mt-4 space-y-1">
                        <Label htmlFor="phone">
                            Phone number
                        </Label>

                        <div className="flex gap-2">
                            <div className="w-24">
                                <Input
                                    value="+91"
                                    disabled
                                    aria-label="Country code"
                                />
                            </div>

                            <div className="flex-1">
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="10-digit number"
                                    value={phoneNumber}
                                    disabled={isLoading}
                                    autoComplete="tel-national"
                                    maxLength={10}
                                    required
                                    onChange={(e) =>
                                        setPhoneNumber(
                                            e.target.value.replace(/\D/g, "").slice(0, 10)
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 space-y-1">
                    <Label htmlFor="password">
                        Password
                    </Label>

                    <div className="relative w-full">
                        <Input
                            id="password"
                            type={
                                showPassword ? "text" : "password"
                            }
                            placeholder="Enter your password"
                            value={password}
                            disabled={isLoading}
                            autoComplete="current-password"
                            required
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isLoading}
                            className="absolute top-1 right-1 hover:translate-y-0"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-4 h-4" />
                            ) : (
                                <EyeIcon className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="submit"
                        size="default"
                        disabled={isLoading || !isLoaded}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </div>
            </form>

            <div className="flex mt-2">
                <p className="text-sm text-muted-foreground text-center w-full">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-foreground font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default SignInPage;
