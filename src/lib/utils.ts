import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CartItem {
  title: string;
  price: number;
  size: string;
  id: number;
  quantity: number;
}

export const updateCartData = () => {
  window.dispatchEvent(new Event("cart-data-updated")); // Manually trigger event
};
