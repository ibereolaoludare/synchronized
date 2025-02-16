import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function Category({ children }: Props) {
    return <>{children}</>;
}

export function CategoryContent({ children }: Props) {
    return <div className="px-32 max-xl:px-24 max-lg:px-16 max-md:px-16 max-sm:px-8">{children}</div>;
}

export function CategoryHeader({ children }: Props) {
    return <div className="max-lg:pt-12 max-md:pt-8 max-sm:pt-4 px-4">{children}</div>;
}

export function CategoryTitle({ children }: Props) {
    return (
        <h1 className="text-sm">
            {children}
        </h1>
    );
}

export function CategoryBody({ children }: Props) {
    return <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-16 max-lg:gap-8 py-8">{children}</div>;
}
