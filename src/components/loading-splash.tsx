import Header from "./header";
import Loader from "./loader";
import { motion } from "framer-motion";

export default function LoadingSplash() {
    return (
        <div className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center z-[120]">
            <motion.div
                animate={{
                    opacity: [0.5, 1], // Fade from 0 (invisible) to 1 (fully visible)
                }}
                transition={{
                    duration: .5, // Duration of one fade cycle (in seconds)
                    repeat: Infinity, // Repeat the animation infinitely
                    ease: "easeIn", // Smooth easing for the fade effect
                }}>
                <Header onlyBrand={true} />
            </motion.div>
            <Loader />
        </div>
    );
}
