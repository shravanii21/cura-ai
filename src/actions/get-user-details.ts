
"use server";

import { db } from "@/lib";
import { currentUser } from "@clerk/nextjs/server";

const getUserDetails = async () => {
    const user = await currentUser();

    if (!user?.id) {
        throw new Error("User not found");
    }

    const dbUser = await db.user.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            age: true,
            height: true,
            weight: true,
            gender: true,
            bloodGroup: true,
        },
    });

    if (!dbUser) {
        throw new Error("User details not found");
    }

    return dbUser;
};

export default getUserDetails;
