import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const icons = [
    { src: "/assets/images/instagram.png", alt: "Instagram", to: "/" },
    { src: "/assets/images/bird.png", alt: "Twitter", to: "/" },
    { src: "/assets/images/phone.png", alt: "Phone", to: "/" },
];

export default function SocialSidebar() {
    return (
        <div className="fixed top-1/2 left-12 flex flex-col items-center justify-center gap-12 -translate-y-1/2 hover:[&>*]:opacity-50 [&>*]:duration-300 max-lg:hidden">
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
                    className="hover:[&>*]:opacity-50 [&>*]:duration-300"
                >
                    <Link to={icon.to} >
                        <img className="h-8" src={icon.src} alt={icon.alt} />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
