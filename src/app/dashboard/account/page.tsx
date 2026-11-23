
import { db } from "@/lib";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import AccountEditButton from "./account-edit-button";

const AccountPage = async () => {
    const user = await currentUser();

    const dbUser = await db.user.findFirst({
        where: {
            id: user?.id,
        },
    });

    return (
        <div className="flex flex-col items-start justify-start w-full max-w-3xl py-8 mx-auto px-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <div className="flex flex-col items-start gap-2">
                    <h2 className="text-xl font-semibold">
                        Account details
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage your account information
                    </p>
                </div>

                <AccountEditButton />
            </div>

            <div className="flex flex-col items-start w-full py-8 gap-y-8">

                <div className="space-y-2">
                    <span className="font-medium text-foreground">
                        Profile
                    </span>

                    <div className="flex items-center gap-8">
                        {user?.imageUrl && (
                            <Image
                                src={user.imageUrl}
                                alt="User"
                                width={48}
                                height={48}
                                unoptimized
                                className="rounded-full w-12 h-12 object-cover"
                            />
                        )}

                        <p className="text-sm">
                            {user?.firstName} {user?.lastName}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="font-medium text-foreground">
                        Email
                    </span>

                    <p className="text-sm">
                        {user?.emailAddresses[0]?.emailAddress || "Not available"}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-md">

                    <div className="space-y-2">
                        <span className="font-medium text-foreground">
                            Age
                        </span>

                        <p className="text-sm">
                            {dbUser?.age ?? "Not added"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-medium text-foreground">
                            Gender
                        </span>

                        <p className="text-sm capitalize">
                            {dbUser?.gender || "Not added"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-medium text-foreground">
                            Blood group
                        </span>

                        <p className="text-sm">
                            {dbUser?.bloodGroup || "Not added"}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-md">

                    <div className="space-y-2">
                        <span className="font-medium text-foreground">
                            Height
                        </span>

                        <p className="text-sm">
                            {dbUser?.height != null
                                ? `${dbUser.height} cm`
                                : "Not added"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-medium text-foreground">
                            Weight
                        </span>

                        <p className="text-sm">
                            {dbUser?.weight != null
                                ? `${dbUser.weight} kg`
                                : "Not added"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AccountPage;
