import React, { useState } from "react";
import { Input } from "./ui/input";

interface Props {
  value?: number;
  maxValue?: number;
  placeholder: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, Props>(({ maxValue, placeholder, value }, ref) => {
  const [valueOf, setValueOf] = useState<number | string>(value || "");

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);

    // Ensure value is positive and within range
    if (maxValue && num > maxValue) num = maxValue;

    setValueOf(num);
  };

  return (
    <Input
      placeholder={placeholder}
      className="rounded-none file:text-xs file:hidden"
      ref={ref}
      type="number"
      value={valueOf}
      onChange={onValueChange}
      min={0}
      max={maxValue}
      required
    />
  );
});

export default NumberInput;
