import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import ArrowRight from "@/components/arrow-right";
import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import supabase from "@/lib/supabase";
import LoadingSplash from "@/components/loading-splash";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { signOut } from "@/lib/utils";

export default function AdminPage() {
    const [isOwned, setIsOwned] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("metadata")
                .select("is_owned");
            if (error) {
                console.error("Error fetching data:", error);
                signOut();
                setTimeout(() => window.location.reload(), 2500);
            } else {
                if (data && data.length > 0) {
                    setIsOwned(data[0].is_owned); // Set isOwned based on the first row
                } else {
                    const { error } = await supabase
                        .from("metadata")
                        .insert({ is_owned: false });
                    if (error) {
                        console.error(error);
                    }
                    setIsOwned(false); // No rows in the table
                }
            }

            // @ts-ignore
            if (data[0].is_owned === true) {
                const { data, error } = await supabase.auth.getUser();
                if (error || data.user === null || data.user === undefined) {
                    console.error("Error: ", error);
                } else if (data.user) {
                    navigate("/dashboard");
                }
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSplash />;
    }

    async function handleCreateAccount(e: any) {
        e.preventDefault();
        if (setIsOwned === null) {
            console.error("Request Denied: Reload Page");
            navigate("/");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        });
        if (error) {
            console.error("Error: ", error);
        } else {
            const { error } = await supabase
                .from("metadata")
                .update({ is_owned: true })
                .eq("is_owned", false);
            if (error) {
                console.error("Error: ", error);
                return;
            }
            setIsOwned(true);
            toast.success("Created account successfully.");
        }
    }

    async function handleLogin(e: any) {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        });
        if (error) {
            toast.error(`${error}`);
        } else {
            toast.success("Logged in successfully.");
            setTimeout(() => navigate("/dashboard"), 2500);
        }
    }

    const loginPage = (
        <motion.div
            key="loginPage" // Unique key for AnimatePresence
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }} // Fade out
            transition={{ duration: 0.5 }} // Animation duration
            className="outline flex flex-col items-center justify-start gap-8 outline-foreground aspect-square p-4">
            <div>
                <Header onlyBrand={true} />
                <h1 className="text-center">Log in to shop</h1>
            </div>
            <form className="flex flex-col justify-center items-center gap-4">
                <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-none !text-xs"
                    ref={emailRef}
                />
                <div className="flex gap-4 w-full">
                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-none !text-xs"
                        ref={passwordRef}
                    />
                    <Button
                        onClick={handleLogin}
                        className="border border-foreground rounded-none aspect-square w-10 bg-foreground/0 hover:bg-foreground/100 hover:text-background"
                        type="submit">
                        <ArrowRight />
                    </Button>
                </div>
                <div className="text-[.65rem] pt-8">
                    <span className="text-slate-200">Not the owner?</span>{" "}
                    <Link
                        to={"/"}
                        className="underline">
                        Go to Homepage -&gt;
                    </Link>
                </div>
            </form>
        </motion.div>
    );

    const createAccount = (
        <motion.div
            key="createAccount" // Unique key for AnimatePresence
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }} // Fade out
            transition={{ duration: 0.5 }} // Animation duration
            className="outline flex flex-col items-center justify-start gap-8 outline-foreground aspect-square p-4 w-min">
            <div className="flex flex-col items-center justify-center">
                <Header onlyBrand={true} />
                <h1 className="text-center w-64">
                    Create an account to own the brand
                </h1>
            </div>
            <form className="flex flex-col justify-center items-center gap-4">
                <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-none !text-xs"
                    ref={emailRef}
                />
                <div className="flex gap-4 w-full">
                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-none !text-xs"
                        ref={passwordRef}
                    />
                    <Button
                        onClick={handleCreateAccount}
                        className="border border-foreground rounded-none aspect-square w-10 bg-foreground/0 hover:bg-foreground/100 hover:text-background"
                        type="submit">
                        <ArrowRight />
                    </Button>
                </div>
                <div className="text-[.65rem] pt-8 text-center">
                    <span className="text-slate-200">
                        You don't want to be the owner?
                    </span>{" "}
                    <Link
                        to={"/"}
                        className="underline">
                        Go to Homepage -&gt;
                    </Link>
                </div>
            </form>
        </motion.div>
    );

    return (
        <>
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <div className="flex flex-col justify-center items-center h-screen">
                <AnimatePresence mode="wait">
                    {isOwned ? loginPage : createAccount}
                </AnimatePresence>
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
        </>
    );
}
