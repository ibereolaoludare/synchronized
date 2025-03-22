import Header from "../components/header";
import { toast, Toaster } from "sonner";
import SocialSidebar from "@/components/social-sidebar";
import { Category, CategoryBody, CategoryContent } from "@/components/category";
import { Particles } from "@/components/magicui/particles";
import { useEffect, useRef, useState, useMemo } from "react";
import { Database } from "@/lib/supabase-types";
import supabase from "@/lib/supabase";
import LoadingSplash from "@/components/loading-splash";
import ShopItem from "@/components/shop-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    filterCategories: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    filterCategories,
}) => {
    return (
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
                    onChange={(e) => filterCategories(e.target.value)}
                    className="border-none !text-xs"
                />
            </div>
        </div>
    );
};

export default function HomePage() {
    const [categories, setCategories] = useState<
        Database["public"]["Tables"]["category"]["Row"][] | undefined
    >(undefined);
    const [searchCategories, setSearchCategories] = useState<
        Database["public"]["Tables"]["category"]["Row"][] | undefined
    >(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const hasChecked = useRef<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const MemoizedHeader = useMemo(() => <Header />, []);

    async function checkCategory() {
        if (hasChecked.current) return true; // Skip if already checked
        hasChecked.current = true;

        const { data, error } = await supabase.from("category").select();

        if (error) {
            toast.error(`${error.message}`);
        } else if (data && data.length) {
            setCategories(data);
            setSearchCategories(data);
            setLoading(false);
            return true;
        }

        return false;
    }

    useEffect(() => {
        checkCategory();
    }, []);

    const filterCategories = useMemo(
        () => (query: string) => {
            setSearchQuery(query);

            const filteredCategories = categories
                ?.map((category) => {
                    if (!category.items) return category;
                    //@ts-ignore
                    const filteredItems = category.items.filter((item) =>
                        item.name.toLowerCase().includes(query.toLowerCase())
                    );
                    return { ...category, items: filteredItems };
                })
                .filter(
                    (category) => category.items && category.items.length > 0
                );

            setSearchCategories(filteredCategories);
        },
        [categories]
    );

    if (loading) {
        return <LoadingSplash />;
    }

    return (
        <>
            <Particles
                className="h-screen fixed w-screen overflow-hidden"
                quantity={50}
            />
            {MemoizedHeader}
            <SocialSidebar />
            <Category>
                <CategoryContent>
                    <SearchBar
                        searchQuery={searchQuery}
                        filterCategories={filterCategories}
                    />
                    <CategoryBody>
                        {searchCategories && searchCategories.length > 0 ? (
                            searchCategories.map((category) =>
                                // @ts-ignore
                                category.items?.map((item, index) => {
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
                                })
                            )
                        ) : (
                            <div className="absolute text-center inset-48 flex items-center justify-center">
                                No items here <br /><br /> :(.
                            </div>
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
