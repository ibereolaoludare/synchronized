import Header from "@/components/header";
import { Particles } from "@/components/magicui/particles";
import { toast, Toaster } from "sonner";
// import { signOut } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, PlusCircle, Store, XCircle } from "lucide-react";
import { generateUUID, signOut } from "@/lib/utils";
import supabase from "@/lib/supabase";
import LoadingSplash from "@/components/loading-splash";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category, CategoryBody, CategoryContent } from "@/components/category";
import ShopItem from "@/components/shop-item";
import NumberInput from "@/components/number-input";
import { Database } from "@/lib/supabase-types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Props {
    jsxID: "shop";
}

interface ShopProps {
    hasCategoryPromise: () => Promise<boolean>;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"shop">("shop");
    const [catergories, setCategories] = useState<
        undefined | Database["public"]["Tables"]["category"]["Row"][]
    >(undefined);

    function ShopTab({ hasCategoryPromise }: ShopProps) {
        const [hasCategory, setHasCategory] = useState<boolean | null>(null);
        const categoryRef = useRef<HTMLInputElement>(null);

        const item: {
            id: string;
            name: React.RefObject<HTMLInputElement>;
            price: React.RefObject<HTMLInputElement>;
            image: File | null;
            stock: React.RefObject<HTMLInputElement>;
        } = {
            id: "",
            name: useRef<HTMLInputElement>(null),
            price: useRef<HTMLInputElement>(null),
            image: null,
            stock: useRef<HTMLInputElement>(null),
        };

        async function handleDeleteCategory(categoryName: string) {
            const { error: deleteError } = await supabase
                .from("category")
                .delete()
                .eq("name", categoryName);
        
            if (deleteError) {
                toast.error(`Delete error: ${deleteError.message}`);
            } else {
                toast.success("Category successfully deleted");
            }
        
            window.location.reload();
        }
        

        async function handleCreateItem(categoryName: string) {
            const itemImage = item.image;

            if (!itemImage) {
                console.error("No image provided");
                return;
            }

            const newItem = {
                id: generateUUID(),
                name: item.name.current?.value,
                price: parseInt(item.price.current?.value ?? "0", 10),
                stock: item.stock.current?.value,
            };

            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("item-images")
                    .upload(
                        `public/${categoryName}/${newItem.id}.png`,
                        itemImage,
                        {
                            cacheControl: "3600",
                            upsert: false,
                        }
                    );

            if (uploadError) {
                console.error("Upload error:", uploadError.message);
                return;
            }

            console.log("Upload success:", uploadData);

            const { data: categoryData, error: categoryError } = await supabase
                .from("category")
                .select("items")
                .eq("name", categoryName)
                .single();

            if (categoryError) {
                console.error("Category fetch error:", categoryError.message);
                return;
            }

            const updatedItems = Array.isArray(categoryData.items)
                ? [...categoryData.items, newItem]
                : [newItem];

            const { error: updateError } = await supabase
                .from("category")
                .update({ items: updatedItems })
                .eq("name", categoryName);

            if (updateError) {
                toast.error(`Update error: updateError.message`);
            } else {
                toast.success("Item successfully added to category");
            }

            window.location.reload();
        }

        useEffect(() => {
            hasCategoryPromise().then((result) => {
                setHasCategory(result);
            });
        }, []);

        async function handleCreateCategory(e: any) {
            e.preventDefault();
            const { error } = await supabase
                .from("category")
                .insert({ name: `${categoryRef.current?.value}`, items: [] });

            if (error) {
                toast.error(`An error occured creating item.`);
            } else {
                toast.success("Category created successfully.");
                setTimeout(() => window.location.reload(), 1000);
            }
        }

        if (hasCategory === true) {
            return (
                <motion.div
                    key="loginPage" // Unique key for AnimatePresence
                    initial={{ opacity: 0 }} // Start invisible
                    animate={{ opacity: 1 }} // Fade in
                    exit={{ opacity: 0 }} // Fade out
                    transition={{ duration: 0.5 }} // Animation duration
                    className="h-full overflow-y-scroll px-4">
                    <h1>Shop</h1>
                    <div className="py-4 h-full">
                        <Dialog>
                            <DialogTrigger className="w-full">
                                <Button className="w-full bg-foreground text-background rounded-none hover:bg-foreground/80 p-6 text-xs">
                                    <PlusCircle />
                                    Create a new category
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                                <DialogHeader>
                                    <DialogTitle className="text-sm">
                                        Create category
                                    </DialogTitle>
                                    <DialogDescription className="text-[0.65rem]">
                                        Enter the name of the category you want
                                        to create.
                                    </DialogDescription>
                                </DialogHeader>
                                <form>
                                    <div className="flex gap-4 w-full">
                                        <Input
                                            placeholder="Category Name"
                                            className="rounded-none !text-xs"
                                            ref={categoryRef}
                                        />
                                    </div>
                                    <div className="py-4">
                                        <div className="flex sm:gap-8 gap-4 justify-end items-center max-sm:justify-between">
                                            <Button
                                                onClick={handleCreateCategory}
                                                type="submit"
                                                className="text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                Create
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {catergories &&
                            catergories.map((category) => (
                                <div
                                    className="py-8 text-sm"
                                    key={category.id}>
                                    <div>{category.name}</div>
                                    <div className="p-8 px-0 gap-4 flex flex-col">
                                        <Dialog>
                                            <DialogTrigger className="w-full">
                                                <Button className="bg-foreground text-background rounded-none hover:bg-foreground/80 p-6 w-full text-xs">
                                                    <PlusCircle />
                                                    Add item to category
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-sm">
                                                        Add Item
                                                    </DialogTitle>
                                                    <DialogDescription className="text-[0.65rem]">
                                                        Enter the details of the
                                                        item.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleCreateItem(
                                                            category.name
                                                        );
                                                    }}>
                                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full [&>div>input]:!text-xs">
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Item Name"
                                                                className="rounded-none !text-xs"
                                                                ref={item.name}
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This will be the
                                                                name of the
                                                                item.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <NumberInput
                                                                ref={item.price}
                                                                placeholder={
                                                                    "Item Price"
                                                                }
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This will be the
                                                                price of the
                                                                item.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Item Image"
                                                                className="rounded-none text-[#737373] file:text-xs file:hidden"
                                                                ref={
                                                                    categoryRef
                                                                }
                                                                type="file"
                                                                accept="image/png"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    item.image =
                                                                        e.target
                                                                            .files
                                                                            ? e
                                                                                  .target
                                                                                  .files[0]
                                                                            : null;
                                                                }}
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This will be the
                                                                display image of
                                                                the item.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <NumberInput
                                                                ref={item.stock}
                                                                maxValue={100}
                                                                placeholder={
                                                                    "Item Stock"
                                                                }
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This will be the
                                                                quantity of the
                                                                item available
                                                                for sale.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="py-4">
                                                        <div className="flex sm:gap-8 gap-4 justify-end items-center max-sm:justify-between">
                                                            <Button
                                                                type="submit"
                                                                className="text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                                Create
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger className="text-xs w-full gap-2 bg-red-500 p-4 flex items-center justify-center rounded-none hover:text-foreground text-foreground hover:bg-red-800 max-sm:text-[.65rem]">
                                                <XCircle size={12} />
                                                Delete category
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="!rounded-none border-0 p-12 gap-12">
                                                <AlertDialogHeader className="[&>*]:text-xs">
                                                    <AlertDialogTitle>
                                                        Delete all cart items?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="[&>*]:text-xs gap-4">
                                                    <AlertDialogCancel className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category.name
                                                            )
                                                        }
                                                        className="uppercase text-xs w-min text-nowrap bg-white text-red-500 border-none rounded-none hover:bg-white/80">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <Category>
                                        <CategoryContent className="!px-0">
                                            <CategoryBody>
                                                {/* @ts-ignore */}
                                                {category.items.length ? (
                                                    // @ts-ignore
                                                    category.items.map(
                                                        // @ts-ignore
                                                        (item, index) => {
                                                            const { data } =
                                                                supabase.storage
                                                                    .from(
                                                                        "item-images"
                                                                    )
                                                                    .getPublicUrl(
                                                                        `public/${category.name}/${item.id}.png`
                                                                    );

                                                            return (
                                                                <ShopItem
                                                                    key={index}
                                                                    image={
                                                                        data.publicUrl
                                                                    }
                                                                    title={
                                                                        item.name
                                                                    }
                                                                    id={item.id}
                                                                    price={
                                                                        item.price
                                                                    }
                                                                    stock={
                                                                        item.stock
                                                                    }
                                                                    categoryName={
                                                                        category.name
                                                                    }
                                                                    editable
                                                                />
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <div className="p-4 text-xs w-full flex items-center justify-center col-span-3">
                                                        No items in this
                                                        category.
                                                    </div>
                                                )}
                                            </CategoryBody>
                                        </CategoryContent>
                                    </Category>
                                </div>
                            ))}
                    </div>
                </motion.div>
            );
        } else if (hasCategory === false) {
            return (
                <motion.div
                    key="loginPage" // Unique key for AnimatePresence
                    initial={{ opacity: 0 }} // Start invisible
                    animate={{ opacity: 1 }} // Fade in
                    exit={{ opacity: 0 }} // Fade out
                    transition={{ duration: 0.5 }} // Animation duration
                    className="w-full h-full flex flex-col gap-12 items-center justify-center text-sm">
                    Your shop seems to be empty.
                    <Dialog>
                        <DialogTrigger>
                            <Button className="bg-foreground text-background rounded-none hover:bg-foreground/80 p-6 text-xs">
                                <PlusCircle />
                                Add to shop
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                            <DialogHeader>
                                <DialogTitle className="text-sm">
                                    Create category
                                </DialogTitle>
                                <DialogDescription className="text-[0.65rem]">
                                    Enter the name of the category you want to
                                    create.
                                </DialogDescription>
                            </DialogHeader>
                            <form>
                                <div className="flex gap-4 w-full">
                                    <Input
                                        placeholder="Category Name"
                                        className="rounded-none !text-xs"
                                        ref={categoryRef}
                                    />
                                </div>
                                <div className="py-4">
                                    <div className="flex sm:gap-8 gap-4 justify-end items-center max-sm:justify-between">
                                        <Button
                                            onClick={handleCreateCategory}
                                            type="submit"
                                            className="text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                            Create
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            );
        }
    }

    function DashboardJSX({ jsxID }: Props) {
        switch (jsxID) {
            case "shop":
                return (
                    <AnimatePresence>
                        <ShopTab hasCategoryPromise={checkCategory} />
                    </AnimatePresence>
                );
        }
    }

    async function checkSession() {
        const { data, error } = await supabase.auth.getUser();
        if (error || data.user === null || data.user === undefined) {
            console.error("Error: ", error);
            navigate("/");
        } else if (data.user) {
            setLoading(false);
        }
    }

    const hasChecked = useRef(false);

    async function checkCategory() {
        if (hasChecked.current) return true; // Skip if already checked
        hasChecked.current = true;

        const { data, error } = await supabase.from("category").select();

        if (error) {
            toast.error(`${error}`);
        } else if (data.length) {
            setCategories(data);
            return true;
        }

        return false;
    }

    useEffect(() => {
        checkSession();
    }, []);

    if (loading) {
        return <LoadingSplash />;
    }

    return (
        <motion.div
            key="loginPage" // Unique key for AnimatePresence
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }} // Fade out
            transition={{ duration: 0.5 }} // Animation duration
        >
            <Particles
                className="h-screen fixed w-screen"
                quantity={50}
            />
            <Header onlyBrand={true} />
            <div className="px-4 max-xl:px-3 max-lg:px-2 gap-4 max-sm:px-1 flex items-center h-[80vh]">
                <div className="border p-8 border-foreground w-3/12 h-full">
                    <h1>Dashboard</h1>
                    <div className="py-4 flex flex-col gap-8">
                        <Button
                            onClick={() => setTab("shop")}
                            className="text-xs bg-white/20 hover:bg-white/40 flex gap-4 items-center justify-start">
                            <Store />
                            <span>Shop</span>
                        </Button>
                        <div className="w-full">
                            <Button
                                onClick={() => {
                                    signOut();
                                    toast.success("Signed out successfully.");
                                    setTimeout(() => navigate("/admin"), 2500);
                                }}
                                className="text-xs bg-white/20 hover:bg-white/40 flex gap-4 items-center justify-start w-full">
                                <ArrowLeft />
                                <span>Sign out</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border border-foreground w-full h-full p-8">
                    <AnimatePresence>
                        <DashboardJSX jsxID={tab} />
                    </AnimatePresence>
                </div>
            </div>
            <Toaster
                position="top-left"
                toastOptions={{
                    style: {
                        borderRadius: 0,
                        fontSize: "10px",
                    },
                }}
            />
        </motion.div>
    );
}
