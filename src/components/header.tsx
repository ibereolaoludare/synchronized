import { Link } from "react-router";
import CartDrawer from "./cart-drawer";

export default function Header() {
    return (
        <div className="p-8 flex flex-col">
            <div className="flex">
                <div className="flex w-full justify-center gap-4 items-center">
                    <img src="/assets/images/stars.svg" />
                    <span className="text-4xl">SYNC</span>
                </div>
                <CartDrawer />
            </div>
            <div className="flex justify-center gap-16 py-4 text-xs hover:[&>*]:opacity-50 [&>*]:duration-300">
                <Link to={"/"}>Home</Link>
                <Link to={"/"}>Catalog</Link>
                <Link to={"/"}>Contact</Link>
            </div>
        </div>
    );
}
