import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "./magicui/text-animate";
import { cn } from "@/lib/utils";

interface Props {
    children: ReactNode;
    className?: string;
}

export function Category({ children }: Props) {
    return <>{children}</>;
}

export function CategoryContent({ children, className }: Props) {
    return (
        <div className={cn("px-32 max-xl:px-24 max-lg:px-16 max-md:px-16 max-sm:px-8", className)}>
            {children}
        </div>
    );
}

export function CategoryHeader({ children, className }: Props) {
    return (
        <div className={cn("max-lg:pt-12 max-md:pt-8 max-sm:pt-4 px-4", className)}>
            {children}
        </div>
    );
}

export function CategoryTitle({ children }: Props) {
    return (
        // @ts-ignore
        <TextAnimate className="text-sm">{children}</TextAnimate>
    );
}

export function CategoryBody({ children }: Props) {
    return (
        <motion.div
            className="grid grid-cols-3 max-lg:grid-cols-2 gap-16 max-lg:gap-8 py-8"
            initial={{ opacity: 0 }} // Start with 0 opacity
            animate={{ opacity: 1 }} // Animate to full opacity
            transition={{ duration: 1 }} // Transition duration
        >
            {children}
        </motion.div>
    );
}
