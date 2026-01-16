import { FacebookIcon, Star, InstagramIcon, GitPullRequestCreateArrowIcon, TwitterIcon } from "lucide-react";
import type React from "react";
import LogoLoop from "./LogoLoop";


const techLogos = [
    { node: <FacebookIcon />, title: "React", href: "https://react.dev" },
    { node: <InstagramIcon />, title: "Next.js", href: "https://nextjs.org" },
    { node: <TwitterIcon />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <GitPullRequestCreateArrowIcon />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];


// const imageLogos = [
//     { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
//     { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
//     { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
// ];



const Banner: React.FC = () => {
    return (
        <div className="w-screen h-[500px] p-2 bg-gray-100 mt-50 flex items-center justify-center">
            <div className="w-full text-black flex flex-col items-center justify-center gap-12">
                <div className="flex items-center justify-center gap-4">
                    <Star fill="black" />
                    <Star fill="black" />
                    <Star fill="black" />
                    <Star fill="black" />
                    <Star fill="black" />
                </div>
                <p className="w-full text-5xl text-center font-[Interif]">"I love the variety of styles and the high-quality clothing on this web <br /> fashion site."</p>
                <p className="w-full text-xl text-center font-[Interif]"> - Some & Co</p>
                <div className="max-w-4xl">
                    <LogoLoop
                        logos={techLogos}
                        speed={120}
                        direction="left"
                        logoHeight={48}
                        gap={40}
                        hoverSpeed={0}
                        scaleOnHover


                        ariaLabel="Technology partners"
                    />
                </div>
            </div>
        </div>
    )
}

export default Banner;