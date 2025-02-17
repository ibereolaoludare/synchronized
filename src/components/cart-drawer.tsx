import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { updateCartData } from "@/lib/utils";
import { TextAnimate } from "./magicui/text-animate";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import ArrowRight from "./arrow-right";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartItem {
    title: string;
    price: number;
    image: string;
    size: string;
    id: number;
    quantity: number;
}

export default function CartDrawer() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [removingItem, setRemovingItem] = useState<number | null>(null);

    // Read cart data from localStorage
    const readCartData = (): CartItem[] => {
        const cartDataString = localStorage.getItem("cart-data");
        return cartDataString ? JSON.parse(cartDataString) : [];
    };

    // Handle single item deletion with animation
    const handleDeleteItem = (id: number) => {
        setRemovingItem(id);
        setTimeout(() => {
            const updatedCartItems = cartItems.filter((item) => item.id !== id);
            setCartItems(updatedCartItems);
            localStorage.setItem("cart-data", JSON.stringify(updatedCartItems));
            updateCartData();
            setRemovingItem(null);
        }, 600); // Matches animation duration
    };

    // Handle full cart deletion with animation
    const handleDeleteAll = () => {
        setRemovingItem(-1); // -1 represents "all items"
        setTimeout(() => {
            setCartItems([]);
            localStorage.setItem("cart-data", JSON.stringify([]));
            updateCartData();
            setRemovingItem(null);
        }, 600); // Matches animation duration
    };

    // Sync cart state with localStorage updates
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartItems(readCartData());
        };

        window.addEventListener("cart-data-updated", handleCartUpdate);
        setCartItems(readCartData());

        return () => {
            window.removeEventListener("cart-data-updated", handleCartUpdate);
        };
    }, []);

    return (
        <Drawer>
            <DrawerTrigger className="shrink-0">
                <Button className="flex justify-end bg-transparent hover:bg-transparent/0 hover:[&>*]:opacity-50 [&>*]:duration-300 shrink-0 p-0">
                    <img
                        src="/assets/images/cart.png"
                        className="h-8 w-8 shrink-0"
                    />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="!rounded-none border-0 px-24 max-lg:px-16 max-sm:px-8 py-6">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle className="max-sm:text-sm">Cart</DrawerTitle>
                    <DrawerClose>
                        <Button className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                            X
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div>
                    <Table className="[&>*]:text-xs">
                        {cartItems.length > 0 && (
                            <TableHeader>
                                <TableRow className="hover:bg-white/0">
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        )}
                        <TableBody className="overflow-scroll ">
                            {cartItems.length === 0 ? (
                                <TableRow className="hover:bg-black/0">
                                    <TableCell
                                        colSpan={4}
                                        className="text-center p-12">
                                        <TextAnimate>
                                            Your cart is empty.
                                        </TextAnimate>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        className="hover:bg-white/10"
                                        initial={{ opacity: 1, height: "auto" }}
                                        animate={
                                            removingItem === item.id ||
                                            removingItem === -1
                                                ? { opacity: 0, height: 0 }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeInOut",
                                        }}>
                                        <TableCell>
                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    <div className="flex gap-12 max-lg:gap-8 max-md:gap-4 max-sm:gap-2">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-20"
                                                        />
                                                        <span className="text-nowrap max-lg:text-wrap uppercase max-sm:text-[.65rem]">
                                                            {item.title}
                                                            <br />
                                                            <br />
                                                            Size: {item.size}
                                                        </span>
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className="rounded-none">
                                                    <ContextMenuItem
                                                        className="text-xs text-red-500 focus:text-red-700/80"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                item.id
                                                            )
                                                        }>
                                                        Delete
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        </TableCell>
                                        <TableCell className=" max-sm:text-[.65rem]">
                                            ${item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="max-sm:text-[.65rem]">{item.quantity}</TableCell>
                                        <TableCell className="text-right max-sm:text-[.65rem]">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {cartItems.length > 0 && (
                    <>
                        <Separator className="bg-transparent py-4" />
                        <div className="flex gap-8 justify-end items-center max-[450px]:justify-between">
                            <AlertDialog>
                                <AlertDialogTrigger className="uppercase text-xs max-sm:text-[.65rem] w-min h-10 px-4 text-nowrap bg-white text-red-500 border-none rounded-none hover:bg-white/80">
                                    Delete all
                                </AlertDialogTrigger>
                                <AlertDialogContent className="!rounded-none border-0 p-12 gap-12">
                                    <AlertDialogHeader className="[&>*]:text-xs">
                                        <AlertDialogTitle>
                                            Delete all cart items?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="[&>*]:text-xs gap-4">
                                        <AlertDialogCancel className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAll}
                                            className="uppercase text-xs w-min text-nowrap bg-white text-red-500 border-none rounded-none hover:bg-white/80">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button className="uppercase text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                Checkout
                                <ArrowRight />
                            </Button>
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
