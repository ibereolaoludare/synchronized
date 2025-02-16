import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import CheckIcon from "./check-icon";
import { toast } from "sonner";
import { updateCartData } from "@/lib/utils";

interface itemData {
    image: string;
    title: string;
    price: number;
    id: number;
    quantity: number;
    size: string | undefined;
}

interface Props {
    data: itemData;
}

export default function AddToCart({ data }: Props) {
    const [clicked, setClicked] = useState(false);

    const handleClick = (data: itemData) => {
        // Check if size is selected
        if (data.size === undefined) {
            toast.error("Please select a size.");
            return;
        } else {
            toast.success("Added item to cart successfully.");
        }

        // Get the existing cart data from localStorage or initialize an empty array
        const cartData: itemData[] = JSON.parse(
            localStorage.getItem("cart-data") || "[]"
        );

        // Check if the item already exists in the cart
        const isItemInCart = cartData.some(
            (item) => item.title === data.title && item.size === data.size && item.id === data.id
        );

        if (!isItemInCart) {
            // Push the new item into the cart data array
            cartData.push(data);

            // Save the updated cart data back to localStorage
            localStorage.setItem("cart-data", JSON.stringify(cartData));
            updateCartData();
        } else {
            toast.error("Item is already in the cart.");
        }

        // Set clicked state for UI feedback
        setClicked(true);
        setTimeout(() => setClicked(false), 1500);
    };

    return (
        <Button
            onClick={() => handleClick(data)}
            className="uppercase text-xs w-full bg-white border-none rounded-none text-black hover:bg-white/80 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: clicked ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center">
                add to cart
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: clicked ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center">
                <CheckIcon
                    width={32}
                    height={32}
                />
            </motion.div>
        </Button>
    );
}
