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
import { useEffect, useRef, useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ShoppingBasket } from "lucide-react";

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
    const [innerDialogState, setInnerDialogState] = useState(false);
    const [drawerState, setDrawerState] = useState(false);
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

    const customerData: {
        firstName: React.RefObject<HTMLInputElement>;
        lastName: React.RefObject<HTMLInputElement>;
        email: React.RefObject<HTMLInputElement>;
        tel: React.RefObject<HTMLInputElement>;
    } = {
        firstName: useRef<HTMLInputElement>(null),
        lastName: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        tel: useRef<HTMLInputElement>(null),
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
        <Drawer
            open={drawerState}
            onOpenChange={() => setDrawerState(!drawerState)}>
            <DrawerTrigger className="shrink-0">
                <Button className="flex justify-end bg-transparent hover:bg-transparent/0 hover:[&>*]:opacity-50 [&>*]:duration-300 shrink-0 p-0">
                    <img
                        src="/assets/images/cart.png"
                        className="h-8 w-8 shrink-0"
                    />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="!rounded-none border-0 px-24 max-lg:px-16 max-sm:px-8 py-6 max-h-[80vh]">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle className="max-sm:text-sm">Cart</DrawerTitle>
                    <DrawerClose>
                        <Button className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                            X
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                {isMobile ? (
                    <>
                        <div className="flex flex-col gap-4 overflow-scroll">
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
                                                        {item.title} -{" "}
                                                        {item.size}
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
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <div className="text-right text-[.65rem] py-2">
                            Total: NGN {cartTotal.toFixed(2)}
                        </div>
                    </>
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
                            <Dialog
                                open={innerDialogState}
                                onOpenChange={() =>
                                    setInnerDialogState(!innerDialogState)
                                }>
                                <DialogTrigger>
                                    <DrawerClose>
                                        <Button className="uppercase text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                            Checkout
                                            <ArrowRight />
                                        </Button>
                                    </DrawerClose>
                                </DialogTrigger>
                                <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                                    <DialogHeader>
                                        <DialogTitle className="text-sm">
                                            Enter your email
                                        </DialogTitle>
                                        <DialogDescription className="text-[0.65rem]"></DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (customerData.email.current) {
                                                setInnerDialogState(false);
                                                setDrawerState(false);
                                                payWithPayStack(
                                                    customerData.email.current?.value,
                                                    100 * cartTotal
                                                );
                                            }
                                        }}>
                                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full [&>div>input]:!text-xs">
                                            <div className="gap-2 flex flex-col">
                                                <Input
                                                    placeholder="First Name"
                                                    // value={title}
                                                    className="rounded-none !text-xs"
                                                    ref={customerData.firstName}
                                                    type="text"
                                                    required
                                                />
                                                <div className="text-[.45rem]">
                                                    This is your first name and
                                                    will be used to contact you.
                                                </div>
                                            </div>
                                            <div className="gap-2 flex flex-col">
                                                <Input
                                                    placeholder="Last Name"
                                                    // value={title}
                                                    className="rounded-none !text-xs"
                                                    ref={customerData.lastName}
                                                    type="text"
                                                    required
                                                />
                                                <div className="text-[.45rem]">
                                                    This is your last name and
                                                    will be used to contact you.
                                                </div>
                                            </div>
                                            <div className="gap-2 flex flex-col">
                                                <Input
                                                    placeholder="Email"
                                                    // value={title}
                                                    className="rounded-none !text-xs"
                                                    ref={customerData.email}
                                                    type="email"
                                                    required
                                                />
                                                <div className="text-[.45rem]">
                                                    This email will be used to
                                                    contact you and is very
                                                    neccesary.
                                                </div>
                                            </div>
                                            <div className="gap-2 flex flex-col">
                                                <Input
                                                    placeholder="Phone No."
                                                    // value={title}
                                                    className="rounded-none !text-xs"
                                                    ref={customerData.tel}
                                                    type="tel"
                                                    required
                                                />
                                                <div className="text-[.45rem]">
                                                    This phone number will be
                                                    used to contact you and is
                                                    very neccesary.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <div className="flex sm:gap-8 gap-4 justify-end items-center max-sm:justify-between">
                                                <Button
                                                    type="submit"
                                                    className="text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                    <ShoppingBasket size={12} />
                                                    BUY
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
