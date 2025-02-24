import Header from "@/components/header";

export default function DashboardPage() {
    return (
        <>
            <Header onlyBrand={true} />
            <div className="px-4 max-xl:px-3 max-lg:px-2 gap-4 max-sm:px-1 flex items-center">
                <div className="bg-foreground w-2/12 h-[80dvh]">

                </div>
                <div className="bg-foreground w-full h-[80dvh]">

                </div>
            </div>
        </>
    );
}
