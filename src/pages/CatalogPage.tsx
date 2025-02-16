import {
    Category,
    CategoryBody,
    CategoryContent,
    CategoryHeader,
    CategoryTitle,
} from "@/components/category";
import Header from "@/components/header";
import ShopItem from "@/components/shop-item";
import SocialSidebar from "@/components/social-sidebar";
import { Toaster } from "sonner";

export default function CatalogPage() {
    return (
        <>
            <Header />
            <SocialSidebar />
            <Category>
                <CategoryContent>
                    <CategoryHeader>
                        <CategoryTitle>Shirts</CategoryTitle>
                    </CategoryHeader>
                    <CategoryBody>
                        <ShopItem
                            image="/assets/images/white-shirt.png"
                            title="white tee-shirt"
                            id={0}
                            price={20}
                        />
                        <ShopItem
                            image="/assets/images/white-shirt.png"
                            title="white tee-shirt"
                            id={1}
                            price={20}
                        />
                        <ShopItem
                            image="/assets/images/white-shirt.png"
                            title="white tee-shirt"
                            id={2}
                            price={20}
                        />
                        <Toaster
                            position="top-left"
                            toastOptions={{
                                style: {
                                    borderRadius: 0,
                                    fontSize: "10px",
                                },
                            }}
                        />
                    </CategoryBody>
                </CategoryContent>
            </Category>
        </>
    );
}
