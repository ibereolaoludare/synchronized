import ShopItem from "@/components/shop-item";
import Header from "../components/header";
import { Toaster } from "sonner";
import SocialSidebar from "@/components/social-sidebar";
import { Category, CategoryBody, CategoryContent } from "@/components/category";
import { Particles } from "@/components/magicui/particles";

export default function HomePage() {
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
                    </CategoryBody>
                </CategoryContent>
                <Toaster
                    position="top-left"
                    toastOptions={{
                        style: {
                            borderRadius: 0,
                            fontSize: "10px",
                        },
                    }}
                />
            </Category>
        </>
    );
}
