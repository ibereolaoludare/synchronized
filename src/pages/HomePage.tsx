import Header from "../components/header";
import { toast, Toaster } from "sonner";
import SocialSidebar from "@/components/social-sidebar";
import { Category, CategoryBody, CategoryContent } from "@/components/category";
import { Particles } from "@/components/magicui/particles";
import { useEffect, useRef, useState } from "react";
import { Database } from "@/lib/supabase-types";
import supabase from "@/lib/supabase";
import LoadingSplash from "@/components/loading-splash";
import ShopItem from "@/components/shop-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HomePage() {
    const [categories, setCategories] = useState<
        undefined | Database["public"]["Tables"]["category"]["Row"][]
    >(undefined);
    const [searchCategories, setSearchCategories] = useState<
        undefined | Database["public"]["Tables"]["category"]["Row"][]
    >(undefined);
    const [loading, setLoading] = useState(true);
    const hasChecked = useRef(false);

    async function checkCategory() {
        if (hasChecked.current) return true; // Skip if already checked
        hasChecked.current = true;

        const { data, error } = await supabase.from("category").select();

        if (error) {
            toast.error(`${error}`);
        } else if (data.length) {
            setCategories(data);
            setLoading(false);
            return true;
        }

        return false;
    }

    useEffect(() => {
        checkCategory();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    function filterCategories(e: string) {
        setSearchQuery(e);

        const filteredCategories = categories
            ?.map((category) => {
                //@ts-ignore
                const filteredItems = category.items.filter((item) =>
                    item.name.toLowerCase().includes(e.toLowerCase())
                );

                return { ...category, items: filteredItems };
            })
            .filter((category) => category.items.length > 0); // Remove empty categories

        setSearchCategories(filteredCategories); // Assuming there's a state setter for this
    }

    if (loading) {
        return <LoadingSplash />;
    }

    return (
        <>
            <Particles
                className="h-screen fixed w-screen overflow-hidden"
                quantity={50}
            />
            <Header />
            <SocialSidebar />
            <Category>
                <CategoryContent>
                    <div className="px-24 max-xl:px-16 max-lg:px-8 max-md:px-8 max-sm:px-0">
                        <div className="p-1 flex border-[1.5px] border-foreground">
                            <Button className="bg-transparent hover:bg-transparent">
                                <Search
                                    strokeWidth={2.5}
                                    size={24}
                                />
                            </Button>
                            <Input
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) =>
                                    filterCategories(e.target.value)
                                }
                                className="border-none !text-xs"
                            />
                        </div>
                    </div>
                    <CategoryBody>
                        {searchCategories &&
                            searchCategories.map(
                                (category) =>
                                    category.items &&
                                    // @ts-ignore
                                    category.items.map(
                                        // @ts-ignore
                                        (item, index) => {
                                            const { data } = supabase.storage
                                                .from("item-images")
                                                .getPublicUrl(
                                                    `public/${category.name}/${item.id}.png`
                                                );

                                            return (
                                                <ShopItem
                                                    key={index}
                                                    image={data.publicUrl}
                                                    title={item.name}
                                                    id={item.id}
                                                    price={item.price}
                                                    stock={item.stock}
                                                />
                                            );
                                        }
                                    )
                            )}
                    </CategoryBody>
                </CategoryContent>
            </Category>
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
