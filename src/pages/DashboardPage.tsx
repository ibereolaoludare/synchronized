import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";

interface Props {
    jsxID: "shop";
}

export default function DashboardPage() {
    function DashboardJSX({ jsxID }: Props) {
        switch (jsxID) {
            case "shop":
                return (
                    <>
                        <h1>Shop</h1>
                        <div>
                            
                        </div>
                    </>
                );
        }
    }

    return (
        <>
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <Header onlyBrand={true} />
            <div className="px-4 max-xl:px-3 max-lg:px-2 gap-4 max-sm:px-1 flex items-center h-[80vh]">
                <div className="border p-8 border-foreground w-3/12 h-full">
                    <h1>Dashboard</h1>
                </div>
                <div className="border border-foreground w-full h-full p-8">
                    <DashboardJSX jsxID="shop" />
                </div>
            </div>
        </>
    );
}
