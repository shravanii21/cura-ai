
const BillingPage = () => {
    return (
        <div className="flex flex-col items-start justify-start w-full max-w-3xl py-8 mx-auto">
            <div className="flex flex-col items-start gap-2">
                <h2 className="text-xl font-semibold">
                    Account Plan
                </h2>
                <p className="text-sm text-muted-foreground">
                    Manage your Cura AI plan
                </p>
            </div>

            <div className="flex flex-col items-start w-full py-8">
                <h4 className="text-lg font-medium">
                    Free Plan
                </h4>
                <p className="text-muted-foreground mt-1">
                    You are currently using the free plan.
                </p>
            </div>
        </div>
    );
};

export default BillingPage;
