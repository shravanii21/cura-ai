
"use client";

import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

import { getUserDetails, updateUser } from "@/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSettingsModal } from "@/hooks";
import { cn, StepOneSchema, StepOneSchemaType } from "@/lib";
import { useClerk } from "@clerk/nextjs";

type Gender = NonNullable<StepOneSchemaType["gender"]>;
type BloodGroup = NonNullable<StepOneSchemaType["bloodGroup"]>;

const isGender = (value: string | null): value is Gender => {
    return ["male", "female", "other"].includes(value ?? "");
};

const isBloodGroup = (value: string | null): value is BloodGroup => {
    return [
        "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-",
    ].includes(value ?? "");
};

const UserDetailsModal = () => {
    const router = useRouter();
    const { user } = useClerk();

    const {
        isPersonalDetailsModalOpen,
        closePersonalDetailsModal,
    } = useSettingsModal();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const form = useForm<StepOneSchemaType>({
        resolver: zodResolver(StepOneSchema),
        defaultValues: {
            age: undefined,
            height: undefined,
            weight: undefined,
            gender: undefined,
            bloodGroup: undefined,
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!isPersonalDetailsModalOpen) return;

        const loadUserDetails = async () => {
            setIsLoadingDetails(true);

            try {
                const details = await getUserDetails();

                reset({
                    age: details.age ?? undefined,
                    height: details.height ?? undefined,
                    weight: details.weight ?? undefined,
                    gender: isGender(details.gender)
                        ? details.gender
                        : undefined,
                    bloodGroup: isBloodGroup(details.bloodGroup)
                        ? details.bloodGroup
                        : undefined,
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Unable to load your personal details");
            } finally {
                setIsLoadingDetails(false);
            }
        };

        loadUserDetails();
    }, [isPersonalDetailsModalOpen, reset]);

    const { mutate, isPending } = useMutation({
        mutationKey: ["update-user-details"],

        mutationFn: async () => {
            if (!user) {
                throw new Error("You must be logged in");
            }

            await updateUser(form.getValues());
        },

        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error("Something went wrong while updating details");
        },

        onSuccess: () => {
            toast.success("Personal details updated successfully!");
            closePersonalDetailsModal();
            router.refresh();
        },
    });

    const onSubmit = () => {
        mutate();
    };

    const isDisabled = isPending || isLoadingDetails;

    const personalDetailsForm = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4 w-full relative"
            >
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Specify your gender</FormLabel>

                            <RadioGroup
                                value={field.value}
                                onChange={field.onChange}
                                className="grid grid-cols-1 md:grid-cols-3 gap-2"
                                disabled={isDisabled}
                            >
                                {(["male", "female", "other"] as const).map(
                                    (gender) => (
                                        <RadioGroup.Option
                                            key={gender}
                                            id={gender}
                                            value={gender}
                                            disabled={isDisabled}
                                            className={({ active, checked }) =>
                                                cn(
                                                    "border-2 border-border rounded-lg w-full py-2 text-center cursor-pointer focus:outline-none disabled:opacity-50 transition",
                                                    (active || checked) &&
                                                        "border-primary"
                                                )
                                            }
                                        >
                                            <RadioGroup.Label
                                                as="span"
                                                className="text-sm capitalize"
                                            >
                                                {gender}
                                            </RadioGroup.Label>
                                        </RadioGroup.Option>
                                    )
                                )}
                            </RadioGroup>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Weight (kg)</FormLabel>
                                <Input
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
                                        )
                                    }
                                    disabled={isDisabled}
                                    placeholder="62"
                                    type="number"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Height (cm)</FormLabel>
                                <Input
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
                                        )
                                    }
                                    disabled={isDisabled}
                                    placeholder="170"
                                    type="number"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>What is your age?</FormLabel>
                                <Input
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
                                        )
                                    }
                                    type="number"
                                    placeholder="25"
                                    disabled={isDisabled}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Your blood group</FormLabel>

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {[
                                            "A+", "A-", "B+", "B-",
                                            "AB+", "AB-", "O+", "O-",
                                        ].map((bloodGroup) => (
                                            <SelectItem
                                                key={bloodGroup}
                                                value={bloodGroup}
                                            >
                                                {bloodGroup}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center justify-end w-full mt-4 gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isDisabled}
                        onClick={closePersonalDetailsModal}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="black"
                        disabled={isDisabled}
                        className="w-28 gap-x-2"
                    >
                        {isDisabled ? (
                            <LoaderIcon className="animate-spin h-4 w-4" />
                        ) : (
                            "Update"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );

    if (isDesktop) {
        return (
            <Dialog
                open={isPersonalDetailsModalOpen}
                onOpenChange={(open) => {
                    if (!open) closePersonalDetailsModal();
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Update your personal details
                        </DialogTitle>
                    </DialogHeader>

                    <div className="pt-3">
                        {personalDetailsForm}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            open={isPersonalDetailsModalOpen}
            onOpenChange={(open) => {
                if (!open) closePersonalDetailsModal();
            }}
        >
            <DrawerContent className="h-max max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DrawerHeader className="text-left">
                    <DrawerTitle>
                        Update your personal details
                    </DrawerTitle>
                </DrawerHeader>

                <div className="px-4 pb-4">
                    {personalDetailsForm}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default UserDetailsModal;
