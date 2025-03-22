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

export async function payWithPayStack(email: string, amount: string) {
    try {
        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${
                        import.meta.env.VITE_PUBLIC_SECRET_PAYSTACK_KEY
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, amount }),
            }
        );

        const data = await response.json();
        console.log(data);

        const popup = new PaystackPop();
        popup.resumeTransaction(data.data.access_code);
        return data;
    } catch (error) {
        console.error("Payment error:", error);
    }
}
