import React, { useState } from "react";
import { Input } from "./ui/input";

interface Props {
  maxValue?: number;
  placeholder: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, Props>(({ maxValue, placeholder }, ref) => {
  const [value, setValue] = useState<number | string>("");

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);

    // Ensure value is positive and within range
    if (maxValue && num > maxValue) num = maxValue;

    setValue(num);
  };

  return (
    <Input
      placeholder={placeholder}
      className="rounded-none file:text-xs file:hidden"
      ref={ref}
      type="number"
      value={value}
      onChange={onValueChange}
      min={0}
      max={maxValue}
      required
    />
  );
});

export default NumberInput;
