import { Link } from "react-router";
import CartDrawer from "./cart-drawer";
import { TextAnimate } from "./magicui/text-animate";
import { SlidingMenuProvider, SlidingMenuTrigger } from "./sliding-menu";

export default function Header() {
    return (
        <SlidingMenuProvider>
            <nav className="p-8 flex flex-col relative z-[40] bg-background">
                <div className="flex">
                    <div className="lg:hidden">
                        <SlidingMenuTrigger />
                    </div>
                    <div className="flex w-full justify-center gap-4 items-center">
                        <img className="max-md:h-8" src="/assets/images/stars.svg" />
                        <span className="text-4xl max-md:text-2xl">SYNC</span>
                    </div>
                    <CartDrawer />
                </div>
                <div className="flex justify-center gap-16 py-4 text-xs hover:[&>*]:opacity-50 [&>*]:duration-300 max-lg:hidden">
                    <Link to={"/"}>
                        <TextAnimate by="character">Home</TextAnimate>
                    </Link>
                    <Link to={"/catalog"}>
                        <TextAnimate by="character">Catalog</TextAnimate>
                    </Link>
                    <Link to={"/"}>
                        <TextAnimate by="character">Contract</TextAnimate>
                    </Link>
                </div>
            </nav>
        </SlidingMenuProvider>
    );
}
