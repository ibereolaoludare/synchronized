import ShopItem from "@/components/shop-item";
import Header from "../components/header";
import { Link } from "react-router";
import { Toaster } from "sonner";

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="fixed top-1/2 left-12 flex flex-col items-center justify-center gap-12 -translate-y-1/2 hover:[&>*]:opacity-50 [&>*]:duration-300">
                <Link to={"/"}>
                    <img
                        className="h-8"
                        src="/assets/images/instagram.png"
                    />
                </Link>
                <Link to={"/"}>
                    <img
                        className="h-8"
                        src="/assets/images/bird.png"
                    />
                </Link>
                <Link to={"/"}>
                    <img
                        className="h-8"
                        src="/assets/images/phone.png"
                    />
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-16 px-32 max-lg:px-24 max-sm:px-16">
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
                <Toaster position="top-left" toastOptions={{style: {
                    borderRadius: 0,
                    fontSize: "10px",
                }}}/>
            </div>
        </>
    );
}
