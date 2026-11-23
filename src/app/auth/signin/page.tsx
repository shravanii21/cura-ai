
"use client";

import { Icons } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
    const router = useRouter();
    const { isLoaded, signIn, setActive } = useSignIn();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailCode, setShowEmailCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const finishSignIn = async (sessionId?: string | null) => {
        if (!sessionId) {
            throw new Error("Session could not be created.");
        }

        if (!setActive) {
            throw new Error("Session activation is unavailable.");
        }

        await setActive({ session: sessionId });
        toast.success("Welcome back!");
        router.replace("/dashboard");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded || !signIn || !setActive) {
            toast.error("Authentication is not ready. Please try again.");
            return;
        }

        if (!email.trim() || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn.create({
                identifier: email.trim(),
                password,
            });

            if (result.status === "complete") {
                await finishSignIn(result.createdSessionId);
                return;
            }

            if (result.status === "needs_second_factor") {
                const emailFactor = result.supportedSecondFactors?.find(
                    (factor) => factor.strategy === "email_code"
                );

                if (!emailFactor || !("emailAddressId" in emailFactor)) {
                    toast.error(
                        "Email verification is not enabled for this account. Check Clerk settings."
                    );
                    return;
                }

                await signIn.prepareSecondFactor({
                    strategy: "email_code",
                    emailAddressId: emailFactor.emailAddressId,
                });

                setShowEmailCode(true);
                toast.success("Verification code sent to your email.");
                return;
            }

            console.error("Incomplete sign-in:", result);
            toast.error(`Additional verification required: ${result.status}`);

        } catch (error: any) {
            console.error("Sign-in error:", error);

            const errorCode = error.errors?.[0]?.code;

            switch (errorCode) {
                case "form_identifier_not_found":
                    toast.error("This email is not registered. Please sign up first.");
                    break;

                case "form_password_incorrect":
                    toast.error("Incorrect password. Please try again.");
                    break;

                case "too_many_attempts":
                    toast.error("Too many attempts. Please try again later.");
                    break;

                default:
                    toast.error(
                        error.errors?.[0]?.message ||
                        "An error occurred. Please try again."
                    );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded || !signIn || !setActive) {
            toast.error("Authentication is not ready. Please try again.");
            return;
        }

        if (!code.trim()) {
            toast.error("Please enter the verification code.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: "email_code",
                code: code.trim(),
            });

            if (result.status === "complete") {
                await finishSignIn(result.createdSessionId);
            } else {
                console.error("Incomplete verification:", result);
                toast.error(`Verification incomplete: ${result.status}`);
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            toast.error(
                error.errors?.[0]?.message ||
                "Invalid verification code. Please try again."
            );
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
                    {showEmailCode ? "Verify Your Email" : "Sign In"}
                </h1>

                <p className="text-muted-foreground">
                    {showEmailCode
                        ? "Enter the verification code sent to your email."
                        : "Welcome back! Sign in to your account."}
                </p>
            </div>

            {showEmailCode ? (
                <form onSubmit={handleEmailCode} className="w-full max-w-xs">
                    <div className="mt-4 space-y-1">
                        <Label htmlFor="code">Email verification code</Label>

                        <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="Enter verification code"
                            value={code}
                            disabled={isLoading}
                            required
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={isLoading || !isLoaded}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Sign In"
                            )}
                        </Button>
                    </div>

                    <button
                        type="button"
                        className="text-sm text-muted-foreground hover:underline w-full mt-4"
                        onClick={() => {
                            setShowEmailCode(false);
                            setCode("");
                        }}
                    >
                        Back to Sign In
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-xs">
                    <div className="mt-4 space-y-1">
                        <Label htmlFor="email">Email address</Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            disabled={isLoading}
                            autoComplete="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 space-y-1">
                        <Label htmlFor="password">Password</Label>

                        <div className="relative w-full">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                disabled={isLoading}
                                autoComplete="current-password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={isLoading}
                                className="absolute top-1 right-1 hover:translate-y-0"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
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
            )}

            {!showEmailCode && (
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
            )}
        </div>
    );
};

export default SignInPage;
