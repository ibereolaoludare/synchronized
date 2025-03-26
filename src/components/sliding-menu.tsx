import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TextAnimate } from "./magicui/text-animate";

interface SlidingMenuContextType {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
}

const SlidingMenuContext = createContext<SlidingMenuContextType | undefined>(
    undefined
);

interface SlidingMenuProviderProps {
    children: ReactNode;
}

export const SlidingMenuProvider: React.FC<SlidingMenuProviderProps> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <SlidingMenuContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
            {children}
            <SlidingMenu menuRef={menuRef} />
        </SlidingMenuContext.Provider>
    );
};

const HamburgerIcon: React.FC<{ isOpen: boolean; onClick: () => void }> = ({
    isOpen,
    onClick,
}) => {
    return (
        <motion.div
            onClick={onClick}
            className="cursor-pointer w-8 h-8 flex flex-col items-center justify-center gap-1.5">
            <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0, }}
                className="w-6 h-0.5 bg-foreground"
            />
            <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="w-6 h-0.5 bg-foreground"
            />
            <motion.div
                initial={false}
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                className="w-6 h-0.5 bg-foreground"
            />
        </motion.div>
    );
};

export const SlidingMenuTrigger: React.FC = () => {
    const context = useContext(SlidingMenuContext);
    if (!context)
        throw new Error(
            "SlidingMenuTrigger must be used within a SlidingMenuProvider"
        );
    const { isOpen, toggleMenu } = context;
    return (
        <HamburgerIcon
            isOpen={isOpen}
            onClick={toggleMenu}
        />
    );
};

const SlidingMenu: React.FC<{ menuRef: React.RefObject<HTMLDivElement> }> = ({ menuRef }) => {
    const context = useContext(SlidingMenuContext);
    if (!context)
        throw new Error(
            "SlidingMenu must be used within a SlidingMenuProvider"
        );
    const { isOpen, closeMenu } = context;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="w-full fixed bg-white border-b border-b-slate-300 z-30 lg:hidden">
                    <div className="flex flex-col items-end">
                        <div className="w-full flex flex-col [&>*]:py-6 [&>*]:px-24 max-lg:[&>*]:px-16 max-sm:[&>*]:px-8 text-xs hover:[&>*]:bg-black/10 text-background font-bold max-sm:text-[.65rem]">
                            <Link
                                to="/"
                                onClick={closeMenu}>
                                <TextAnimate delay={300}>Home</TextAnimate>
                            </Link>
                            <Link
                                to="/catalog"
                                onClick={closeMenu}>
                                <TextAnimate delay={300}>Catalog</TextAnimate>
                            </Link>
                            <Link
                                to="/contact"
                                onClick={closeMenu}>
                                <TextAnimate delay={300}>Contact</TextAnimate>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SlidingMenu;