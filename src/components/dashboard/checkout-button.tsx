
"use client";

import { Button } from "../ui/button";

interface Props {
    isPro: boolean;
}

const CheckoutButton = ({ isPro }: Props) => {
    return (
        <div className="flex flex-col items-start w-full">
            {!isPro && (
                <Button
                    type="button"
                    variant="black"
                    className="mt-4 min-w-36"
                    disabled
                >
                    Upgrade to Pro
                </Button>
            )}
        </div>
    );
};

export default CheckoutButton;
