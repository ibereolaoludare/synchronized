import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import supabase from "./supabase";
import PaystackPop from "@paystack/inline-js";
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

export function generateUUID() {
    return crypto.randomUUID();
}

export async function payWithPayStack(
    amount: number,
    customerData: {
        email: string,
        firstName: string,
        lastName: string,
        tel: string,
    },
    callback?: () => void
) {
    try {
        const popup = new PaystackPop();
        // @ts-ignore
        popup.newTransaction({
            key: import.meta.env.VITE_PUBLIC_PUBLIC_PAYSTACK_KEY,
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            phone: customerData.tel,
            amount: amount,
            onSuccess: (transaction) => {
                if(transaction.status === "success" && callback)
                    callback()
            },
        });
    } catch (error) {
        console.error("Payment error:", error);
    }
}
