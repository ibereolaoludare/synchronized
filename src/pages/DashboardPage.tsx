import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";
import { Toaster } from "sonner";
// import { signOut } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft, Store } from "lucide-react";
import { signOut } from "@/lib/utils";

interface Props {
    jsxID: "shop";
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<"shop">("shop");

    function DashboardJSX({ jsxID }: Props) {
        switch (jsxID) {
            case "shop":
                return (
                    <>
                        <h1>Shop</h1>
                        <div></div>
                    </>
                );
        }
    }

    return (
        <motion.div
            key="loginPage" // Unique key for AnimatePresence
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }} // Fade out
            transition={{ duration: 0.5 }} // Animation duration
        >
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <Header onlyBrand={true} />
            <div className="px-4 max-xl:px-3 max-lg:px-2 gap-4 max-sm:px-1 flex items-center h-[80vh]">
                <div className="border p-8 border-foreground w-3/12 h-full">
                    <h1>Dashboard</h1>
                    <div className="py-4 flex flex-col gap-8">
                        <Button
                            onClick={() => setTab("shop")}
                            className="text-xs bg-white/20 hover:bg-white/40 flex gap-4 items-center justify-start">
                            <Store />
                            <span>Shop</span>
                        </Button>
                        <div className="w-full">
                            <Button
                                onClick={() => {signOut(); navigate("/admin")}}
                                className="text-xs bg-white/20 hover:bg-white/40 flex gap-4 items-center justify-start w-full">
                                <ArrowLeft />
                                <span>Sign out</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border border-foreground w-full h-full p-8">
                    <DashboardJSX jsxID={tab} />
                </div>
            </div>
            <Toaster
                position="top-left"
                toastOptions={{
                    style: {
                        borderRadius: 0,
                        fontSize: "10px",
                    },
                }}
            />
        </motion.div>
    );
}
