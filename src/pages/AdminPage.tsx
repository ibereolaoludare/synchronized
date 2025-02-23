"use client"; // Add this if you're using Next.js App Router

import { useEffect, useState } from "react";
import ArrowRight from "@/components/arrow-right";
import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase-types";
import { Link } from "react-router";

const supabase = createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
    const [isOwned, setIsOwned] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("isOwned").select();
            if (error) {
                console.error("Error fetching data:", error);
            } else {
                setIsOwned(data.length > 0); // Assuming `isOwned` table has rows if the brand is owned
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const loginPage = (
        <div className="outline flex flex-col items-center justify-start gap-8 outline-white aspect-square p-4">
            <div>
                <Header onlyBrand={true} />
                <h1 className="text-center">Log in to shop</h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
                <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-none !text-xs"
                />
                <div className="flex gap-4 w-full">
                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-none !text-xs"
                    />
                    <Button className="border border-white rounded-none aspect-square w-10 bg-foreground/0 hover:bg-foreground/100 hover:text-background">
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
            </div>
        </div>
    );

    const createAccount = (
        <div className="outline flex flex-col items-center justify-start gap-8 outline-white aspect-square p-4">
            <div>
                <Header onlyBrand={true} />
                <h1 className="text-center">
                    Create an account to own the brand
                </h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
                <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-none !text-xs"
                />
                <div className="flex gap-4 w-full">
                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-none !text-xs"
                    />
                    <Button className="border border-white rounded-none aspect-square w-10 bg-foreground/0 hover:bg-foreground/100 hover:text-background">
                        <ArrowRight />
                    </Button>
                </div>
                <div className="text-[.65rem] pt-8">
                    <span className="text-slate-200">
                        You don't want to be the owner?
                    </span>{" "}
                    <Link
                        to={"/"}
                        className="underline">
                        Go to Homepage -&gt;
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <div className="flex flex-col justify-center items-center h-screen">
                {isOwned ? loginPage : createAccount}
            </div>
        </>
    );
}
