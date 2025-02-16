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

    // Function to read cart data from localStorage
    const readCartData = (): CartItem[] => {
        const cartDataString = localStorage.getItem("cart-data");
        return cartDataString ? JSON.parse(cartDataString) : [];
    };

    // Function to delete an item from the cart
    const handleDeleteItem = (id: number) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem("cart-data", JSON.stringify(updatedCartItems));

        // Dispatch a custom event to notify other components
        updateCartData();
    };

    // Update cartItems state whenever localStorage changes
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartItems(readCartData());
        };

        // Listen for custom event
        window.addEventListener("cart-data-updated", handleCartUpdate);

        // Initial read of cart data
        setCartItems(readCartData());

        // Cleanup event listener
        return () => {
            window.removeEventListener("cart-data-updated", handleCartUpdate);
        };
    }, []);

    return (
        <Drawer>
            <DrawerTrigger>
                <Button className="flex justify-end bg-transparent hover:bg-transparent/0 hover:[&>*]:opacity-50 [&>*]:duration-300">
                    <img
                        src="/assets/images/cart.png"
                        className="h-8"
                    />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="!rounded-none border-0 max-h-1/2 px-12 py-6">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle>Cart</DrawerTitle>
                    <DrawerClose>
                        <Button className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                            X
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div>
                    <Table className="[&>*]:text-xs">
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
                        <TableBody>
                            {cartItems.length === 0 ? (
                                <TableRow className="hover:bg-black/0">
                                    <TableCell
                                        colSpan={4}
                                        className="text-center p-12">
                                        Your cart is empty.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cartItems.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        className="hover:bg-white/10">
                                        <TableCell>
                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    <div className="flex gap-12">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-20"
                                                        />
                                                        <span className="text-nowrap uppercase">
                                                            {item.title} - Size:{" "}
                                                            {item.size}
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
                                        <TableCell>
                                            ${item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
