import { Link } from "react-router";
import CartDrawer from "./cart-drawer";
import { TextAnimate } from "./magicui/text-animate";
import { SlidingMenuProvider, SlidingMenuTrigger } from "./sliding-menu";

export default function Header() {
    return (
        <SlidingMenuProvider>
            <nav className="px-24 max-lg:px-16 max-sm:px-8 py-8 flex flex-col relative z-[40] bg-background">
                <div className="flex items-center">
                    <div className="lg:hidden">
                        <SlidingMenuTrigger />
                    </div>
                    <Link className="w-full" to={"/admin"}>
                        <div className="flex w-full justify-center gap-4 items-center">
                            <img
                                className="max-md:h-8"
                                src="/assets/images/stars.svg"
                            />
                            <span className="text-4xl max-md:text-2xl">
                                SYNC
                            </span>
                        </div>
                    </Link>
                    <CartDrawer />
                </div>
                <div className="flex justify-center gap-16 py-4 text-xs hover:[&>*]:opacity-50 [&>*]:duration-300 max-lg:hidden">
                    <Link to={"/"}>
                        <TextAnimate by="character">Home</TextAnimate>
                    </Link>
                    <Link to={"/catalog"}>
                        <TextAnimate by="character">Catalog</TextAnimate>
                    </Link>
                    <Link to={"/contact"}>
                        <TextAnimate by="character">Contact</TextAnimate>
                    </Link>
                </div>
            </nav>
        </SlidingMenuProvider>
    );
}
