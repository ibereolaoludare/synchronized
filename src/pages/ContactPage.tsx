import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";

const contacts = [
    {
        src: "/assets/images/instagram.png",
        imgAlt: "@",
        alt: "Instagram",
        to: "/",
        description: (
            <>
                Talk to us on Instagram at{" "}
                <span className="flex items-center justify-center bg-foreground/20 rounded w-min px-1 text-nowrap">
                    @synchronized
                </span>
            </>
        ),
    },
    {
        src: "/assets/images/bird.png",
        imgAlt: "@",
        alt: "Twitter",
        to: "/",
        description: (
            <>
                Talk to us on Twitter at{" "}
                <span className="flex items-center justify-center bg-foreground/20 rounded w-min px-1 text-nowrap">
                    @synchronized
                </span>
            </>
        ),
    },
    {
        src: "/assets/images/phone.png",
        imgAlt: "@",
        alt: "Phone",
        to: "/",
        description: (
            <>
                Talk to us on Phone at{" "}
                <span className="flex items-center justify-center bg-foreground/20 rounded w-min px-1 text-nowrap">
                    +234 81 3001 5634
                </span>
            </>
        ),
    },
    {
        src: "/assets/images/phone.png",
        alt: "Mail",
        to: "/",
        description: (
            <>
                Talk to us on Mail at{" "}
                <span className="flex items-center justify-center bg-foreground/20 rounded w-min px-1 text-nowrap">
                    @synchronized
                </span>
            </>
        ),
    },
];

export default function ContactPage() {
    return (
        <>
            <Particles
                className="h-screen fixed w-screen overflow-hidden"
                quantity={50}
            />
            <Header />
            <div className="py-12 pt-4 px-32 max-xl:px-24 max-lg:px-16 max-md:px-16 max-sm:px-8 flex flex-col items-center">
                <h1 className="pb-16 max-sm:pb-8 max-md:text-lg text-center text-2xl">
                    Contact our friendly team
                </h1>
                <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-24 max-lg:gap-16 hover:[&>*]:opacity-50 [&>*]:duration-300">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={contact.alt}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                ease: "linear",
                                delay: index * 0.1, // Stagger effect
                            }}
                            className="hover:[&>*]:opacity-50 p-4 outline h-64 max-lg:h-60 max-md:h-52 max-sm:w-full max-sm:h-auto outline-white aspect-square [&>*]:duration-300">
                            <Link to={contact.to}>
                                {contact.imgAlt ? (
                                    <img
                                        className="h-8 outline outline-white"
                                        src={contact.src}
                                        alt={contact.alt}
                                    />
                                ) : (
                                    <div className="h-8 flex items-center justify-center w-min outline outline-white aspect-square text-xl">
                                        @
                                    </div>
                                )}
                                <div className="pt-8 flex flex-col gap-2">
                                    <h1 className="max-md:text-sm">
                                        {contact.alt}
                                    </h1>
                                    <div className="text-[.65rem]">
                                        {contact.description}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
