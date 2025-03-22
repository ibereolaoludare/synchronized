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
import { payWithPayStack, updateCartData } from "@/lib/utils";
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
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        updateIsMobile();
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    const readCartData = (): CartItem[] => {
        const cartDataString = localStorage.getItem("cart-data");
        return cartDataString ? JSON.parse(cartDataString) : [];
    };

    const handleDeleteItem = (id: number) => {
        setRemovingItem(id);
        setTimeout(() => {
            const updatedCartItems = cartItems.filter((item) => item.id !== id);
            setCartItems(updatedCartItems);
            localStorage.setItem("cart-data", JSON.stringify(updatedCartItems));
            updateCartData();
            setRemovingItem(null);
        }, 300);
    };

    const handleDeleteAll = () => {
        setRemovingItem(-1);
        setTimeout(() => {
            setCartItems([]);
            localStorage.setItem("cart-data", JSON.stringify([]));
            updateCartData();
            setRemovingItem(null);
        }, 600);
    };

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

    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        let i: number = 0;

        cartItems.forEach((item) => {
            i += item.price * item.quantity;
        });

        setCartTotal(i);
    }, [cartItems]); // Added dependency array

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
                {isMobile ? (
                    <div className="flex flex-col gap-4">
                        {cartItems.length === 0 ? (
                            <div className="p-12 items-center justify-center flex">
                                <TextAnimate className="text-[0.65rem]">
                                    Your cart is empty.
                                </TextAnimate>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="flex-col gap-4 items-center p-4 cursor-pointer hover:bg-white/10"
                                    initial={{ opacity: 1, height: "auto" }}
                                    animate={
                                        removingItem === item.id ||
                                        removingItem === -1
                                            ? { opacity: 0, height: 0 }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}>
                                    <div className="flex gap-4 h-max">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-16"
                                        />
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <p className="text-[.65rem] uppercase">
                                                    {item.title} - {item.size}
                                                </p>
                                            </div>
                                            <p className="text-[.65rem]">
                                                Price: NGN{" "}
                                                {item.price.toFixed(2)}
                                            </p>
                                            <p className="text-[.65rem]">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-[.65rem] items-end flex justify-between pt-4">
                                        <div
                                            className="text-red-500 hover:text-red-500/80"
                                            onClick={() =>
                                                handleDeleteItem(item.id)
                                            }>
                                            Delete
                                        </div>
                                        <div>
                                            Total -{" "}
                                            {"NGN " +
                                                (
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div className="text-right text-[.65rem]">
                            Total: NGN {cartTotal.toFixed(2)}
                        </div>
                    </div>
                ) : (
                    <>
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
                            <TableBody className="overflow-scroll">
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
                                            className="hover:bg-white/10 h-min"
                                            initial={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            animate={
                                                removingItem === item.id ||
                                                removingItem === -1
                                                    ? { opacity: 0, height: 0 }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}>
                                            <TableCell>
                                                <div className="flex gap-12 max-lg:gap-8 max-md:gap-4 max-sm:gap-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-20"
                                                    />
                                                    <div className="flex flex-col gap-3 text-nowrap max-lg:text-wrap uppercase max-sm:text-[.65rem]">
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                        <span>
                                                            Size: {item.size}
                                                        </span>
                                                        <div
                                                            className="text-red-500 cursor-pointer hover:text-red-500/80"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    item.id
                                                                )
                                                            }>
                                                            Delete
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className=" max-sm:text-[.65rem]">
                                                NGN {item.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="max-sm:text-[.65rem]">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right max-sm:text-[.65rem]">
                                                NGN
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="text-right text-xs w-full pt-2">
                            Total: NGN {cartTotal.toFixed(2)}
                        </div>
                    </>
                )}
                {cartItems.length > 0 && (
                    <>
                        <Separator className="bg-transparent py-4" />
                        <div className="flex sm:gap-8 justify-end items-center max-sm:justify-between">
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
                                    <AlertDialogFooter className="[&>*]:text-xs gap-4 sm:flex-row">
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
                            <DrawerClose>
                                <Button
                                    onClick={() =>
                                        payWithPayStack(
                                            "test@gmail.com",
                                            (cartTotal * 100).toString()
                                        )
                                    }
                                    className="uppercase text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                    Checkout
                                    <ArrowRight />
                                </Button>
                            </DrawerClose>
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
