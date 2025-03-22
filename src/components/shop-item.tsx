import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import ArrowUpRightBit from "./arrow-ur-bit";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import AddToCart from "./add-to-cart";
import { useRef, useState } from "react";
import { Pencil, ShoppingBasket, XCircle } from "lucide-react";
import NumberInput from "./number-input";
import { Input } from "./ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { payWithPayStack } from "@/lib/utils";

interface Props {
    image: string;
    title: string;
    price: number;
    stock: number;
    categoryName?: string;
    id: string;
    editable?: boolean;
}

export default function ShopItem({
    title,
    image,
    price,
    id,
    stock,
    categoryName,
    editable,
}: Props) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(
        undefined
    );
    const item: {
        name: React.RefObject<HTMLInputElement>;
        price: React.RefObject<HTMLInputElement>;
        stock: React.RefObject<HTMLInputElement>;
    } = {
        name: useRef<HTMLInputElement>(null),
        price: useRef<HTMLInputElement>(null),
        stock: useRef<HTMLInputElement>(null),
    };

    const customerData: {
        firstName: React.RefObject<HTMLInputElement>;
        lastName: React.RefObject<HTMLInputElement>;
        email: React.RefObject<HTMLInputElement>;
        tel: React.RefObject<HTMLInputElement>;
    } = {
        firstName: useRef<HTMLInputElement>(null),
        lastName: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        tel: useRef<HTMLInputElement>(null),
    };

    const [quantity, setQuantity] = useState(1);
    const [dialogState, setDialogState] = useState(false);
    const [innerDialogState, setInnerDialogState] = useState(false);
    const [itemName, setItemName] = useState(title);

    async function handleEditItem(
        categoryName: string,
        id: string,
        item: {
            name: React.RefObject<HTMLInputElement>;
            price: React.RefObject<HTMLInputElement>;
            stock: React.RefObject<HTMLInputElement>;
        }
    ) {
        const { data: categoryData, error: categoryError } = await supabase
            .from("category")
            .select("items")
            .eq("name", categoryName)
            .single();

        if (categoryError) {
            console.error("Category fetch error:", categoryError.message);
            return;
        }

        if (!categoryData?.items) {
            console.error("No items found in category");
            return;
        }

        //@ts-ignore
        const updatedItems = categoryData.items.map((existingItem: any) =>
            existingItem.id === id
                ? {
                      ...existingItem,
                      name: item.name.current?.value || existingItem.name,
                      price: parseInt(item.price.current?.value || "0", 10),
                      stock: item.stock.current?.value || existingItem.stock,
                  }
                : existingItem
        );

        const { error: updateError } = await supabase
            .from("category")
            .update({ items: updatedItems })
            .eq("name", categoryName);

        if (updateError) {
            toast.error(`Update error: ${updateError.message}`);
        } else {
            toast.success("Item successfully updated");
        }

        window.location.reload();
    }

    async function handleDeleteItem(categoryName: string, id: string) {
        const { data: categoryData, error: categoryError } = await supabase
            .from("category")
            .select("items")
            .eq("name", categoryName)
            .single();

        if (categoryError) {
            console.error("Category fetch error:", categoryError.message);
            return;
        }

        if (!categoryData?.items) {
            console.error("No items found in category");
            return;
        }

        // @ts-ignore
        const updatedItems = categoryData.items.filter(
            (item: any) => item.id !== id
        );

        const { error: updateError } = await supabase
            .from("category")
            .update({ items: updatedItems })
            .eq("name", categoryName);

        if (updateError) {
            toast.error(`Delete error: ${updateError.message}`);
        } else {
            toast.success("Item successfully deleted");
        }

        window.location.reload();
    }

    return (
        <div className="aspect-square gap-4 flex flex-col items-center justify-center [&>img]:hover:opacity-65 [&>*>.dialog-trigger]:hover:outline [&>*>.dialog-trigger]:hover:outline-white">
            <img
                src={image}
                className="max-h-40 duration-300"
            />
            <Dialog
                open={dialogState}
                onOpenChange={() => setDialogState(!dialogState)}>
                <DialogTrigger
                    onMouseDown={() => {
                        setSelectedSize(undefined);
                        setQuantity(1);
                    }}>
                    <div className="dialog-trigger text-xs max-sm:text-[.65rem] flex flex-col items-center py-4 px-4 max-lg:px-3 max-sm:px-2 gap-2 cursor-pointer hover:bg-white hover:text-background duration-300 transition-colors border-slate-300">
                        <h1 className="uppercase w-full text-center flex items-center justify-center shrink-0 gap-2 text-[.65rem]">
                            {!editable ? (
                                <ArrowUpRightBit
                                    height={16}
                                    width={16}
                                    className="max-md:hidden"
                                />
                            ) : (
                                <Pencil size={12} />
                            )}
                            <span>{title}</span>
                        </h1>
                        <h2>NGN {price}</h2>
                    </div>
                </DialogTrigger>
                {editable ? (
                    <DialogContent className="!rounded-none border-0 p-12 flex justify-center max-w-[40rem] gap-12 max-lg:px-16 max-sm:px-8">
                        <div className="flex items-center justify-center w-1/2">
                            <img
                                src={image}
                                alt={title}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col w-1/2 h-full">
                            <div className="flex flex-col gap-20">
                                <DialogHeader className="uppercase gap-4 max-sm:text-left max-sm:text-[.65rem] flex flex-col">
                                    <DialogTitle className="text-xs max-sm:text-[.65rem]">
                                        {title}
                                    </DialogTitle>
                                    <h2 className="text-xs max-sm:text-[.65rem] text-gray-300">
                                        NGN {price}
                                    </h2>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Dialog>
                                            <DialogTrigger className="flex justify-center items-center p-3 duration-300 gap-2 uppercase text-xs w-full bg-foreground border rounded-none text-background hover:bg-foreground/80 max-sm:text-[.65rem]">
                                                <Pencil size={12} />
                                                EDIT
                                            </DialogTrigger>
                                            <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-sm">
                                                        Edit Item
                                                    </DialogTitle>
                                                    <DialogDescription className="text-[0.65rem]">
                                                        Edit the details of the
                                                        item.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEditItem(
                                                            categoryName ??
                                                                "none",
                                                            id,
                                                            item
                                                        );
                                                    }}>
                                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full [&>div>input]:!text-xs">
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Item Name"
                                                                // value={title}
                                                                className="rounded-none !text-xs"
                                                                ref={item.name}
                                                                value={itemName}
                                                                onChange={(e) =>
                                                                    setItemName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
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
                                                                placeholder="Item Price"
                                                                value={price}
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This will be the
                                                                price of the
                                                                item.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <NumberInput
                                                                ref={item.stock}
                                                                maxValue={100}
                                                                placeholder={
                                                                    "Item Stock"
                                                                }
                                                                value={stock}
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
                                                                <Pencil
                                                                    size={12}
                                                                />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        {/* <Button></Button> */}
                                        <AlertDialog>
                                            <AlertDialogTrigger className="uppercase text-xs w-full bg-red-500 p-3 rounded-none flex items-center justify-center gap-2 hover:text-foreground text-foreground hover:bg-red-800 max-sm:text-[.65rem]">
                                                <XCircle size={12} />
                                                Delete
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="!rounded-none border-0 p-12 gap-12">
                                                <AlertDialogHeader className="[&>*]:text-xs">
                                                    <AlertDialogTitle>
                                                        Delete item?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="[&>*]:text-xs gap-4">
                                                    <AlertDialogCancel className="uppercase text-xs w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                categoryName ??
                                                                    "",
                                                                id
                                                            )
                                                        }
                                                        className="uppercase text-xs w-min text-nowrap bg-white text-red-500 border-none rounded-none hover:bg-white/80">
                                                        <XCircle size={12} />
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                ) : (
                    <DialogContent className="!rounded-none border-0 p-12 flex justify-center max-w-[40rem] gap-12 max-lg:px-16 max-sm:px-8">
                        <div className="flex items-center justify-center w-1/2">
                            <img
                                src={image}
                                alt={title}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col w-1/2 h-full">
                            <div className="flex flex-col gap-20">
                                <DialogHeader className="uppercase gap-4 max-sm:text-left max-sm:text-[.65rem] flex flex-col">
                                    <DialogTitle className="text-xs max-sm:text-[.65rem]">
                                        {title}
                                    </DialogTitle>
                                    <h2 className="text-xs max-sm:text-[.65rem] text-gray-300">
                                        NGN {price}
                                    </h2>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-items-center">
                                            <Button
                                                onClick={() =>
                                                    setQuantity(
                                                        (i) =>
                                                            (i =
                                                                i > 1
                                                                    ? i - 1
                                                                    : 1)
                                                    )
                                                }
                                                className="uppercase basis-1/3 text-xs w-full bg-white border-none rounded-none text-black hover:bg-white/80">
                                                -
                                            </Button>
                                            <div className="uppercase flex flex-col p-1 items-center text-center basis-1/3">
                                                <h1 className="text-xs max-sm:text-[.65rem]">
                                                    qty:
                                                </h1>
                                                <span className="text-xs max-sm:text-[.65rem]">
                                                    {quantity}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    setQuantity(
                                                        (i) => (i = i + 1)
                                                    )
                                                }
                                                className="uppercase text-xs w-full basis-1/3 bg-white border-none rounded-none text-black hover:bg-white/80">
                                                +
                                            </Button>
                                        </div>
                                        <Select>
                                            <SelectTrigger className="w-full [&>*]:text-xs max-sm:[&>*]:text-[.65rem] bg-black text-white rounded-none border border-white">
                                                <SelectValue placeholder="Size" />
                                            </SelectTrigger>
                                            <SelectContent className="[&>*>*]:text-xs  max-sm:[&>*>*]:text-[.65rem] rounded-none">
                                                <SelectItem
                                                    value="small"
                                                    onMouseDown={() => {
                                                        setSelectedSize(
                                                            "small"
                                                        );
                                                    }}>
                                                    S
                                                </SelectItem>
                                                <SelectItem
                                                    value="medium"
                                                    onMouseDown={() => {
                                                        setSelectedSize(
                                                            "medium"
                                                        );
                                                    }}>
                                                    M
                                                </SelectItem>
                                                <SelectItem
                                                    value="large"
                                                    onMouseDown={() => {
                                                        setSelectedSize(
                                                            "large"
                                                        );
                                                    }}>
                                                    L
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <AddToCart
                                            data={{
                                                title: title,
                                                image: image,
                                                price: price,
                                                id: id,
                                                quantity: quantity,
                                                size: selectedSize,
                                            }}
                                        />
                                        <Dialog
                                            open={innerDialogState}
                                            onOpenChange={() => {
                                                if (selectedSize) {
                                                    setInnerDialogState(
                                                        !innerDialogState
                                                    );
                                                } else if (innerDialogState) {
                                                    setInnerDialogState(
                                                        !innerDialogState
                                                    );
                                                } else {
                                                    toast.error(
                                                        "Please select a size."
                                                    );
                                                    return;
                                                }
                                            }}>
                                            <DialogTrigger className="flex justify-center items-center p-3 duration-300 gap-2 uppercase text-xs w-full bg-foreground/0 border rounded-none text-foreground hover:text-background hover:bg-foreground/100 max-sm:text-[.65rem]">
                                                BUY NOW
                                            </DialogTrigger>
                                            <DialogContent className="!rounded-none border-0 p-12 flex flex-col max-w-[40rem] gap-4 max-lg:px-16 max-sm:px-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-sm">
                                                        Enter your details
                                                    </DialogTitle>
                                                    <DialogDescription className="text-[0.65rem]"></DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        customerData.email
                                                            .current &&
                                                            setDialogState(
                                                                false
                                                            );
                                                        if (
                                                            customerData.email
                                                                .current &&
                                                            selectedSize
                                                        ) {
                                                            payWithPayStack(
                                                                100 * price,
                                                                {
                                                                    email: customerData
                                                                        .email
                                                                        .current
                                                                        ?.value,
                                                                    firstName:
                                                                        customerData
                                                                            .firstName
                                                                            .current
                                                                            ?.value ??
                                                                        "",
                                                                    lastName:
                                                                        customerData
                                                                            .lastName
                                                                            .current
                                                                            ?.value ??
                                                                        "",
                                                                    tel:
                                                                        customerData
                                                                            .tel
                                                                            .current
                                                                            ?.value ??
                                                                        "",
                                                                },
                                                                async () => {
                                                                    const data =
                                                                        {
                                                                            email: customerData
                                                                                .email
                                                                                .current
                                                                                ?.value ?? "",
                                                                            firstName:
                                                                                customerData
                                                                                    .firstName
                                                                                    .current
                                                                                    ?.value ??
                                                                                "",
                                                                            lastName:
                                                                                customerData
                                                                                    .lastName
                                                                                    .current
                                                                                    ?.value ??
                                                                                "",
                                                                            tel:
                                                                                customerData
                                                                                    .tel
                                                                                    .current
                                                                                    ?.value ??
                                                                                "",
                                                                        };

                                                                    const item =
                                                                        {
                                                                            title: title,
                                                                            image: image,
                                                                            price: price,
                                                                            id: id,
                                                                            quantity:
                                                                                quantity,
                                                                            size: selectedSize,
                                                                        };

                                                                        const { error } = await supabase
                                                                        .from('orders')
                                                                        .insert({items_ordered: [item], customer_data: data})
                                                                }
                                                            );
                                                        }
                                                    }}>
                                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full [&>div>input]:!text-xs">
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="First Name"
                                                                // value={title}
                                                                className="rounded-none !text-xs"
                                                                ref={
                                                                    customerData.firstName
                                                                }
                                                                type="text"
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This is your
                                                                first name and
                                                                will be used to
                                                                contact you.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Last Name"
                                                                // value={title}
                                                                className="rounded-none !text-xs"
                                                                ref={
                                                                    customerData.lastName
                                                                }
                                                                type="text"
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This is your
                                                                last name and
                                                                will be used to
                                                                contact you.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Email"
                                                                // value={title}
                                                                className="rounded-none !text-xs"
                                                                ref={
                                                                    customerData.email
                                                                }
                                                                type="email"
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This email will
                                                                be used to
                                                                contact you and
                                                                is very
                                                                neccesary.
                                                            </div>
                                                        </div>
                                                        <div className="gap-2 flex flex-col">
                                                            <Input
                                                                placeholder="Phone No."
                                                                // value={title}
                                                                className="rounded-none !text-xs"
                                                                ref={
                                                                    customerData.tel
                                                                }
                                                                type="tel"
                                                                required
                                                            />
                                                            <div className="text-[.45rem]">
                                                                This phone
                                                                number will be
                                                                used to contact
                                                                you and is very
                                                                neccesary.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="py-4">
                                                        <div className="flex sm:gap-8 gap-4 justify-end items-center max-sm:justify-between">
                                                            <Button
                                                                type="submit"
                                                                className="text-xs max-sm:text-[.65rem] w-min bg-white border-none rounded-none text-black hover:bg-white/80">
                                                                <ShoppingBasket
                                                                    size={12}
                                                                />
                                                                BUY
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
