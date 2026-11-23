
"use client";

import { Icons } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/nextjs";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SignUpPage = () => {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailCode, setShowEmailCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showIncompleteStatus = (result: any) => {
        console.error(
            "Incomplete sign-up details:",
            JSON.stringify(result, null, 2)
        );

        console.error("Missing fields:", result.missingFields);
        console.error("Unverified fields:", result.unverifiedFields);
        console.error("Required fields:", result.requiredFields);

        toast.error(
            `Account setup requires another step. Status: ${result.status}`
        );
    };

    const handleSignUp = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!isLoaded || !signUp || !setActive) {
            toast.error("Authentication is not ready. Please try again.");
            return;
        }

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 15) {
            toast.error("Password must be at least 15 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const nameParts = name.trim().split(/\s+/);
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ");

            await signUp.create({
                emailAddress: email.trim(),
                password,
                firstName,
                lastName,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setCode("");
            setShowEmailCode(true);

            toast.success("Verification code sent to your email.");

        } catch (error: any) {
            console.error("Sign-up error details:", error);

            toast.error(
                error.errors?.[0]?.message ||
                error.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyEmail = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!isLoaded || !signUp || !setActive) {
            toast.error("Authentication is not ready. Please try again.");
            return;
        }

        if (!code.trim()) {
            toast.error("Please enter the verification code.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: code.trim(),
            });

            if (result.status === "complete") {
                if (!result.createdSessionId) {
                    throw new Error("Session could not be created.");
                }

                await setActive({
                    session: result.createdSessionId,
                });

                toast.success("Account created successfully!");

                router.replace("/auth/auth-callback");
                return;
            }

            showIncompleteStatus(result);

        } catch (error: any) {
            console.error("Email verification error details:", error);

            const errorCode = error.errors?.[0]?.code;

            if (errorCode === "verification_already_verified") {
                toast.error(
                    "This email is already verified. Please try signing in."
                );
            } else {
                toast.error(
                    error.errors?.[0]?.message ||
                    error.message ||
                    "Email verification failed. Please try again."
                );
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
                    {showEmailCode ? "Verify Your Email" : "Create Account"}
                </h1>

                <p className="text-muted-foreground">
                    {showEmailCode
                        ? "Enter the verification code sent to your email."
                        : "Create your Cura AI account to get started."}
                </p>
            </div>

            {showEmailCode ? (
                <form
                    onSubmit={handleVerifyEmail}
                    className="w-full max-w-xs"
                >
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
                                "Verify Email"
                            )}
                        </Button>
                    </div>

                    <button
                        type="button"
                        disabled={isLoading}
                        className="text-sm text-muted-foreground hover:underline w-full mt-4"
                        onClick={() => {
                            setShowEmailCode(false);
                            setCode("");
                        }}
                    >
                        Back to Sign Up
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={handleSignUp}
                    className="w-full max-w-xs"
                >
                    <div className="mt-4 space-y-1">
                        <Label htmlFor="name">Full Name</Label>

                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            disabled={isLoading}
                            autoComplete="name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                                placeholder="Create a password"
                                value={password}
                                disabled={isLoading}
                                autoComplete="new-password"
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

                    <div className="mt-4 space-y-1">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <div className="relative w-full">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                disabled={isLoading}
                                autoComplete="new-password"
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={isLoading}
                                className="absolute top-1 right-1 hover:translate-y-0"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
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
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {!showEmailCode && (
                <div className="flex mt-2">
                    <p className="text-sm text-muted-foreground text-center w-full">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="text-foreground font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SignUpPage;
