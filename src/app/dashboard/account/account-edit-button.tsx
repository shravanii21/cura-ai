
"use client";

import { Button } from "@/components/ui/button";
import UserDetailsModal from "@/components/modals/user-details-modal";
import { useSettingsModal } from "@/hooks";
import { Pencil } from "lucide-react";

const AccountEditButton = () => {
    const { openPersonalDetailsModal } = useSettingsModal();

    return (
        <>
            <Button
                type="button"
                onClick={openPersonalDetailsModal}
                className="gap-2"
            >
                <Pencil className="w-4 h-4" />
                Edit Profile
            </Button>

            <UserDetailsModal />
        </>
    );
};

export default AccountEditButton;
