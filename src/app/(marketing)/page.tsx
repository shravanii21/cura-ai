
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { buttonVariants } from "@/components/ui/button";
import { FEATURES } from "@/constants";
import { ArrowRightIcon, HeartPulse, Bot, Activity } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const WHY_CHOOSE_CURA = [
    {
        title: "Health Tracking",
        info: "Keep your health information, symptoms and medications organized in one place.",
        icon: HeartPulse,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "AI Assistant",
        info: "Get personalized wellness insights and interact with your virtual health assistant.",
        icon: Bot,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "Health Insights",
        info: "Understand your health information and explore helpful tips for a healthier lifestyle.",
        icon: Activity,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
];

const HomePage = () => {
    const baseDelay = 0.2;

    return (
        <>
            {/* hero */}
            <MaxWidthWrapper className="flex flex-col items-center w-full relative">
                <div className="flex flex-col items-center justify-center w-full py-20 text-center">
                    <div className="flex items-center justify-center lg:gap-16 w-full absolute top-[15%] left-1/2 -translate-x-1/2 -z-10">
                        <div className="w-52 h-52 rounded-full bg-orange-500 blur-[10rem] opacity-70 -z-10"></div>
                        <div className="hidden lg:w-52 h-52 rounded-full bg-amber-500 blur-[10rem] opacity-70 -z-10"></div>
                    </div>

                    <h1 className="text-foreground py-6 text-4xl sm:text-6xl md:text-7xl font-semibold md:font-bold !leading-snug tracking-normal text-balance w-full">
                        Your personal <br />
                        <span className="bg-gradient-to-r from-primary to-amber-500 text-transparent bg-clip-text">
                            health
                        </span>{" "}
                        assistant
                    </h1>

                    <p className="text-muted-foreground text-base md:text-lg max-w-xl py-2">
                        Instantly get the right medications for your symptoms with AI-powered recommendations
                    </p>

                    <div className="flex flex-row md:flex-row items-center justify-center gap-4 mt-8 w-full">
                        <Link href="/dashboard" className={buttonVariants()}>
                            Start for free
                            <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                        </Link>
                    </div>
                </div>

                <div className="relative py-20 bg-transparent w-full mx-auto">
                    <AnimationContainer delay={baseDelay + 0.3} className="flex items-center justify-center">
                        <div className="absolute md:top-[20%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[10rem] animate-image-glow"></div>

                        <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl mx-auto flex items-center justify-center w-max">
                            <Image
                                src="/images/dashboard.png"
                                alt="Dashboard"
                                width={2560}
                                height={1426}
                                quality={100}
                                priority
                                className="rounded-md lg:rounded-xl mx-auto bg-foreground/10 ring-1 ring-border"
                            />
                        </div>
                    </AnimationContainer>
                </div>
            </MaxWidthWrapper>

            {/* features */}
            <MaxWidthWrapper className="py-10">
                <div className="flex flex-col text-start md:text-center justify-center w-full py-8 max-w-md mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold font-heading text-foreground mt-6">
                        Features that will <span className="text-gradient">amaze</span> you
                    </h2>

                    <p className="mt-4 text-muted-foreground max-w-lg">
                        Cura is packed with features that will help you get the right medications for your symptoms
                    </p>
                </div>

                <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-8 md:gap-x-8 w-full">
                    {FEATURES.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-start">
                            <feature.icon className="w-8 h-8 text-primary" />

                            <h3 className="text-lg font-medium font-heading mt-4">
                                {feature.title}
                            </h3>

                            <p className="text-muted-foreground mt-1 text-sm md:text-base">
                                {feature.info}
                            </p>
                        </div>
                    ))}
                </div>
            </MaxWidthWrapper>

            {/* why choose cura */}
            <MaxWidthWrapper className="py-16">
                <div className="flex flex-col text-center items-center justify-center w-full py-8 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold font-heading text-foreground mt-6">
                        Why choose <span className="text-gradient">Cura?</span>
                    </h2>

                    <p className="mt-4 text-muted-foreground max-w-lg">
                        Your health journey deserves care, clarity and smart technology. Explore what makes Cura your everyday health companion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 w-full">
                    {WHY_CHOOSE_CURA.map((item, index) => (
                        <AnimationContainer
                            key={item.title}
                            delay={baseDelay + index / 5}
                            className="h-full"
                        >
                            <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${item.bg}`}>
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>

                                <h3 className="text-xl font-semibold font-heading mt-6">
                                    {item.title}
                                </h3>

                                <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed">
                                    {item.info}
                                </p>
                            </div>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>

            {/* cta */}
            <MaxWidthWrapper className="py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 max-w-full mx-auto w-full py-8 text-start gap-8">
                    <div className="flex w-full relative">
                        <Image
                            src="/images/mockup-phone.svg"
                            alt="mockup"
                            width={1000}
                            height={1200}
                            quality={100}
                            priority
                            className="mx-auto lg:mr-auto h-[420px] max-w-full sm:max-w-sm"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center text-center md:items-start md:text-start w-full">
                        <h2 className="text-3xl md:text-4xl font-semibold font-heading text-foreground">
                            Start your journey to better health
                        </h2>

                        <p className="text-muted-foreground max-w-lg mt-4">
                            Tried of feeling sick? Get started with Cura today and get the right medications for your symptoms
                        </p>

                        <Link href="/dashboard" className={buttonVariants({ className: "mt-8" })}>
                            Renew your health
                            <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                        </Link>
                    </div>
                </div>
            </MaxWidthWrapper>
        </>
    );
};

export default HomePage;
