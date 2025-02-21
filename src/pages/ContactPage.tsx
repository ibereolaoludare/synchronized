import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/header";

const icons = [
    { src: "/assets/images/instagram.png", alt: "Instagram", to: "/" },
    { src: "/assets/images/bird.png", alt: "Twitter", to: "/" },
    { src: "/assets/images/phone.png", alt: "Phone", to: "/" },
];

export default function ContactPage() {
    return (
        <>
            <Header />
            <div className="py-12 pt-4 flex flex-col items-center">
                <h1 className="p">Contact</h1>
                <div>
                    
                </div>
                <div className="flex items-center justify-center gap-12 hover:[&>*]:opacity-50 [&>*]:duration-300">
                    {icons.map((icon, index) => (
                        <motion.div
                            key={icon.alt}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                ease: "linear",
                                delay: index * 0.1, // Stagger effect
                            }}
                            className="hover:[&>*]:opacity-50 [&>*]:duration-300">
                            <Link to={icon.to}>
                                <img
                                    className="h-8"
                                    src={icon.src}
                                    alt={icon.alt}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
