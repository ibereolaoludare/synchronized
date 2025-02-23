import { Link } from "react-router";
import CartDrawer from "./cart-drawer";
import { TextAnimate } from "./magicui/text-animate";
import { SlidingMenuProvider, SlidingMenuTrigger } from "./sliding-menu";

interface Props {
    onlyBrand?: boolean;
}

export default function Header({ onlyBrand }: Props) {
    return (
        <SlidingMenuProvider>
            <nav className="px-24 max-lg:px-16 max-sm:px-8 py-8 flex flex-col relative z-[40] bg-background">
                {!onlyBrand ? (
                    <>
                        <div className="flex items-center">
                            <div className="lg:hidden">
                                <SlidingMenuTrigger />
                            </div>
                            <div className="flex w-full justify-center gap-4 items-center">
                                <Link to={"/admin"}>
                                    <img
                                        className="max-md:h-8"
                                        src="/assets/images/stars.svg"
                                    />
                                </Link>
                                <Link to={"/"}>
                                    <span className="text-4xl max-md:text-2xl">
                                        SYNC
                                    </span>
                                </Link>
                            </div>
                            <CartDrawer />
                        </div>
                        <div className="flex justify-center gap-16 py-4 text-xs hover:[&>*]:opacity-50 [&>*]:duration-300 max-lg:hidden">
                            <Link to={"/"}>
                                <TextAnimate by="character">Home</TextAnimate>
                            </Link>
                            <Link to={"/catalog"}>
                                <TextAnimate by="character">
                                    Catalog
                                </TextAnimate>
                            </Link>
                            <Link to={"/contact"}>
                                <TextAnimate by="character">
                                    Contact
                                </TextAnimate>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex w-full justify-center gap-4 items-center">
                        <Link to={"/admin"}>
                            <img
                                className="max-md:h-8"
                                src="/assets/images/stars.svg"
                            />
                        </Link>
                        <Link to={"/"}>
                            <span className="text-4xl max-md:text-2xl">
                                SYNC
                            </span>
                        </Link>{" "}
                    </div>
                )}
            </nav>
        </SlidingMenuProvider>
    );
}
