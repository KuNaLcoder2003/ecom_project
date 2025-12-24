import type React from "react"

interface Props {
    title: string,
    content: string,
    image_class: string,
    image_src: string,
    show_blob: boolean,
    class_name?: string
}
const Hero: React.FC<Props> = ({ title, content, image_class, image_src, show_blob, class_name }) => {
    return (
        <div className={`w-screen h-[440px] bg-stone-100 ${class_name} overflow-hidden`}>
            <div className="flex relative w-full justify-around items-center h-full z-10">
                <div className="flex flex-col items-baseline gap-12 z-20">
                    <div className="flex flex-col items-baseline">
                        <h2 className="text-4xl font-bold font-[InterSerif]">{title}</h2>
                        <p className="text-stone-400 font-[InterSerif] text-sm w-[50%]">{content}</p>
                    </div>

                    <button className="text-white bg-black p-2 px-4 rounded-lg cursor-pointer">{"View Collection   ->"}</button>
                </div>

                <div className="relative z-20">
                    <div className="p-2">
                        <img src={image_src} className={image_class} />
                    </div>
                </div>
                {
                    show_blob && <div className="absolute w-1/2 -right-65 top-20">
                        <img src="./assets/Ellipse.png" />
                    </div>
                }
            </div>
        </div>
    )
}

export default Hero;