import ArrowRight from "@/components/arrow-right";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Particles } from "@/components/magicui/particles";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function ErrorPage() {
    return (
        <div className="h-screen w-screen">
            <Particles
                className="h-screen fixed w-screen overflow-hidden"
                quantity={50}
            />
            <div className="h-full w-full gap-4 text-white flex flex-col justify-center items-center absolute top-0 left-0">
                <NumberTicker
                    value={404}
                    className="text-7xl text-white"
                />
                <div className="sm:w-4/6 flex flex-col items-center justify-center gap-2">
                    <TypingAnimation className="text-sm font-normal text-center">
                        Woah, how did we get here?
                    </TypingAnimation>
                    <TextAnimate className="text-[.65rem] w-4/6 text-slate-200 text-center">
                        If this persists, we might not be synchronized this time.
                    </TextAnimate>
                </div>
                <Link to={"/"}>
                    <Button className="uppercase text-xs w-min bg-foreground border-none rounded-none text-black hover:bg-foreground/80">
                        Go to Homepage
                        <ArrowRight />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
