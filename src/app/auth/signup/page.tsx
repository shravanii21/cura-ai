
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon,
} from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import { Icons } from "@/components";

type SignupMethod = "email" | "phone";

const SignUpPage = () => {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [signupMethod, setSignupMethod] =
        useState<SignupMethod>("email");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const [isVerified, setIsVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const identifier =
        signupMethod === "email"
            ? email.trim()
            : `+91${phoneNumber}`;

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!isLoaded || !signUp) return;

        const trimmedName = name.trim();

        if (!trimmedName || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (signupMethod === "email" && !email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        if (
            signupMethod === "phone" &&
            !/^\d{10}$/.test(phoneNumber)
        ) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must contain at least 8 characters.");
            return;
        }

        const nameParts = trimmedName.split(/\s+/);

        setIsLoading(true);

        try {
            await signUp.create({
                ...(signupMethod === "email"
                    ? { emailAddress: identifier }
                    : { phoneNumber: identifier }),

                password,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(" "),
            });

            if (signupMethod === "email") {
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
            } else {
                await signUp.preparePhoneNumberVerification({
                    strategy: "phone_code",
                    channel: "sms",
                });
            }

            setIsVerified(true);
            setCode("");

            toast.success(
                signupMethod === "email"
                    ? "Verification code sent to your email."
                    : "Verification code sent to your phone."
            );

        } catch (error: any) {
            console.error("SIGN UP ERROR:", error);

            const clerkError = error?.errors?.[0];

            toast.error(
                clerkError?.longMessage ||
                clerkError?.message ||
                error?.message ||
                "Signup failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!isLoaded || !signUp) return;

        if (code.trim().length !== 6) {
            toast.error("Please enter the complete 6-digit verification code.");
            return;
        }

        setIsVerifying(true);

        try {
            const result =
                signupMethod === "email"
                    ? await signUp.attemptEmailAddressVerification({
                        code: code.trim(),
                    })
                    : await signUp.attemptPhoneNumberVerification({
                        code: code.trim(),
                    });

            console.log("CLERK SIGNUP RESULT:", result);

            if (result.status === "complete") {
                if (!result.createdSessionId) {
                    toast.error(
                        "Verification completed, but session is missing."
                    );
                    return;
                }

                await setActive({
                    session: result.createdSessionId,
                });

                toast.success("Account created successfully!");

                router.replace("/auth/auth-callback");
                return;
            }

            console.error("SIGNUP INCOMPLETE:", {
                status: result.status,
                missingFields: result.missingFields,
                unverifiedFields: result.unverifiedFields,
            });

            toast.error(
                `Signup incomplete. Status: ${result.status}`
            );

        } catch (error: any) {
            console.error("VERIFICATION ERROR:", error);

            const clerkError = error?.errors?.[0];

            toast.error(
                clerkError?.longMessage ||
                clerkError?.message ||
                error?.message ||
                "Verification failed. Please check your code."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    return isVerified ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-y-6 px-4">

            <div className="flex flex-col text-center gap-1">
                <Link href="/">
                    <Icons.logo className="w-12 h-12 mx-auto" />
                </Link>

                <h1 className="text-2xl font-bold font-heading mt-2">
                    Please check your {signupMethod === "email" ? "email" : "phone"}
                </h1>

                <p className="text-muted-foreground">
                    We&apos;ve sent a verification code to {identifier}
                </p>
            </div>

            <form
                onSubmit={handleVerify}
                className="w-full max-w-xs"
            >
                <div className="space-y-2 flex flex-col items-center justify-center">
                    <Label htmlFor="verification-code">
                        Verification Code
                    </Label>

                    <InputOTP
                        id="verification-code"
                        maxLength={6}
                        value={code}
                        disabled={isVerifying}
                        onChange={setCode}
                        className="pt-2"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="mt-6">
                    <Button
                        size="default"
                        type="submit"
                        disabled={isVerifying || code.length !== 6}
                        className="w-full"
                    >
                        {isVerifying ? (
                            <LoaderIcon className="w-4 h-4 animate-spin" />
                        ) : (
                            "Verify Code"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-screen gap-y-6 px-4">

            <div className="flex flex-col text-center gap-1">
                <Link href="/">
                    <Icons.logo className="w-12 h-12 mx-auto" />
                </Link>

                <h1 className="text-2xl font-bold font-heading mt-2">
                    Sign Up
                </h1>

                <p className="text-muted-foreground">
                    Create an account to start using Cura AI
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xs"
            >
                <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>

                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        disabled={isLoading}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mt-4 space-y-2">
                    <Label>Sign up using</Label>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant={
                                signupMethod === "email"
                                    ? "default"
                                    : "outline"
                            }
                            disabled={isLoading}
                            onClick={() => setSignupMethod("email")}
                        >
                            Email
                        </Button>

                        <Button
                            type="button"
                            variant={
                                signupMethod === "phone"
                                    ? "default"
                                    : "outline"
                            }
                            disabled={isLoading}
                            onClick={() => setSignupMethod("phone")}
                        >
                            Phone Number
                        </Button>
                    </div>
                </div>

                {signupMethod === "email" ? (
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
                            required
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
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
                                    required
                                    maxLength={10}
                                    autoComplete="tel-national"
                                    onChange={(e) =>
                                        setPhoneNumber(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10)
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
                            required
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
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
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-4 h-4" />
                            ) : (
                                <EyeIcon className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Use at least 8 characters for your password.
                    </p>
                </div>

                <div className="mt-6">
                    <Button
                        type="submit"
                        size="default"
                        disabled={isLoading || !isLoaded}
                        className="w-full"
                    >
                        {isLoading ? (
                            <LoaderIcon className="w-4 h-4 animate-spin" />
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </form>

            <div className="flex mt-2">
                <p className="text-sm text-muted-foreground text-center w-full">
                    Been here before?{" "}
                    <Link
                        href="/auth/signin"
                        className="text-foreground font-medium hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
