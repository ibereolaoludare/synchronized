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
}

export default function ShopItem({ title, image, price, id }: Props) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(
        undefined
    );

    const [quantity, setQuantity] = useState(1);

    return (
        <div className="aspect-square    gap-4 flex flex-col items-center justify-center [&>img]:hover:opacity-65 [&>*>.dialog-trigger]:hover:border">
            <img
                src={image}
                className="w-min duration-300 h-40"
            />
            <Dialog>
                <DialogTrigger onMouseDown={() => setSelectedSize(undefined)}>
                    <div className="dialog-trigger text-xs flex flex-col items-center p-4 gap-2 cursor-pointer hover:bg-white hover:text-background duration-300 transition-colors border-slate-300">
                        <h1 className="uppercase w-full text-center flex items-center justify-center gap-2">
                            <ArrowUpRightBit
                                height={16}
                                width={16}
                            />
                            <span>{title}</span>
                        </h1>
                        <h2>${price}</h2>
                    </div>
                </DialogTrigger>
                <DialogContent className="!rounded-none border-0 p-12 flex justify-center max-w-[40rem] gap-12">
                    <div className="flex items-center justify-center w-1/2">
                        <img
                            src={image}
                            alt={title}
                            className="h-full"
                        />
                    </div>
                    <div className="flex flex-col w-1/2 h-full">
                        <div className="flex flex-col gap-20">
                            <DialogHeader className="uppercase gap-4 text-xs">
                                <DialogTitle className="text-xs">
                                    {title}
                                </DialogTitle>
                                <h2 className="text-xs text-gray-300">
                                    ${price}
                                </h2>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-items-center">
                                        <Button
                                            onClick={() =>
                                                setQuantity((i) => (i = i > 1 ? i - 1 : 1))
                                            }
                                            className="uppercase basis-1/3 text-xs w-full bg-white border-none rounded-none text-black hover:bg-white/80">
                                            -
                                        </Button>
                                        <div className="uppercase flex flex-col p-1 items-center text-center basis-1/3">
                                            <h1 className="text-xs">qty:</h1>
                                            <span className="text-xs">
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
                                        <SelectTrigger className="w-full [&>*]:text-xs bg-black text-white rounded-none border border-white">
                                            <SelectValue placeholder="Size" />
                                        </SelectTrigger>
                                        <SelectContent className="[&>*>*]:text-xs rounded-none">
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
                                    <Button className="uppercase text-xs w-full bg-orange-500 border-none rounded-none text-black hover:bg-orange-500/80">
                                        BUY
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
