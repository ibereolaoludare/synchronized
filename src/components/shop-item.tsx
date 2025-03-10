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
import { useState } from "react";

interface Props {
    image: string;
    title: string;
    price: number;
    id: number;
    disableClickable?: boolean;
}

export default function ShopItem({
    title,
    image,
    price,
    id,
    disableClickable,
}: Props) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(
        undefined
    );

    const [quantity, setQuantity] = useState(1);

    return (
        <div className="aspect-square gap-4 flex flex-col items-center justify-center [&>img]:hover:opacity-65 [&>*>.dialog-trigger]:hover:outline [&>*>.dialog-trigger]:hover:outline-white">
            <img
                src={image}
                className="max-h-40 duration-300"
            />
            <Dialog>
                <DialogTrigger
                    onClick={(e) => {
                        if (disableClickable) e.preventDefault();
                        return;
                    }}
                    onMouseDown={() => {
                        setSelectedSize(undefined);
                        setQuantity(1);
                    }}>
                    <div className="dialog-trigger text-xs max-sm:text-[.65rem] flex flex-col items-center py-4 px-4 max-lg:px-3 max-sm:px-2 gap-2 cursor-pointer hover:bg-white hover:text-background duration-300 transition-colors border-slate-300">
                        <h1 className="uppercase w-full text-center flex items-center justify-center shrink-0 gap-2 text-[.65rem]">
                            {!disableClickable && (
                                <ArrowUpRightBit
                                    height={16}
                                    width={16}
                                    className="max-md:hidden"
                                />
                            )}
                            <span>{title}</span>
                        </h1>
                        <h2>${price}</h2>
                    </div>
                </DialogTrigger>
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
                                    ${price}
                                </h2>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-items-center">
                                        <Button
                                            onClick={() =>
                                                setQuantity(
                                                    (i) =>
                                                        (i = i > 1 ? i - 1 : 1)
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
                                                setQuantity((i) => (i = i + 1))
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
                                                    setSelectedSize("small");
                                                }}>
                                                S
                                            </SelectItem>
                                            <SelectItem
                                                value="medium"
                                                onMouseDown={() => {
                                                    setSelectedSize("medium");
                                                }}>
                                                M
                                            </SelectItem>
                                            <SelectItem
                                                value="large"
                                                onMouseDown={() => {
                                                    setSelectedSize("large");
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
                                    <Button className="uppercase text-xs w-full bg-transparent border rounded-none hover:text-black text-white hover:bg-white max-sm:text-[.65rem]">
                                        BUY NOW
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
