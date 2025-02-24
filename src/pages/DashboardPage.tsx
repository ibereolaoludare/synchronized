import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";

export default function DashboardPage() {
    return (
        <>
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <Header onlyBrand={true} />
            <div className="px-4 max-xl:px-3 max-lg:px-2 gap-4 max-sm:px-1 flex items-center h-[80vh]">
                <div className="border p-4 border-foreground w-3/12 h-full">
                    <h1>Dashboard</h1>
                </div>
                <div className="border border-foreground w-full h-full"></div>
            </div>
        </>
    );
}
