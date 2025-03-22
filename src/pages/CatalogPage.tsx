import {
    Category,
    CategoryBody,
    CategoryContent,
    CategoryHeader,
    CategoryTitle,
} from "@/components/category";
import Header from "@/components/header";
import LoadingSplash from "@/components/loading-splash";
import { Particles } from "@/components/magicui/particles";
import ShopItem from "@/components/shop-item";
import SocialSidebar from "@/components/social-sidebar";
import supabase from "@/lib/supabase";
import { Database } from "@/lib/supabase-types";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

export default function CatalogPage() {
    const [catergories, setCategories] = useState<
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
            setLoading(false)
            return true;
        }

        return false;
    }

    useEffect(() => {
        checkCategory();
    }, []);

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
            {catergories &&
                catergories.map((category) => (
                    <Category>
                        <CategoryContent>
                            <CategoryHeader>
                                <CategoryTitle>{category.name}</CategoryTitle>
                            </CategoryHeader>
                            <CategoryBody>
                                {category.items ?
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
                                    ) : (
                                        <div className="absolute text-center inset-48 flex items-center justify-center">
                                            No items here <br /><br /> :(.
                                        </div>
                                    )}
                            </CategoryBody>
                        </CategoryContent>
                    </Category>
                ))}
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
