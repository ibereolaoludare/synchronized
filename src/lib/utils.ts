import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import supabase from "./supabase";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const updateCartData = () => {
    window.dispatchEvent(new Event("cart-data-updated")); // Manually trigger event
};

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error: ", error);
    }
}
