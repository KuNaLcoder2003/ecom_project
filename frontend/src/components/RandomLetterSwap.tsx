'use client'

import { useState } from "react"
import { type AnimationOptions, motion, useAnimate } from "framer-motion"
import { debounce } from "lodash"

interface TextProps {
    label: string
    reverse?: boolean
    transition?: AnimationOptions
    staggerDuration?: number
    className?: string
    onClick?: () => void
}

export function RandomLetterSwapForward({
    label,
    reverse = true,
    transition = {
        type: "spring",
        duration: 0.8,
    },
    staggerDuration = 0.02,
    className,
    onClick,
    ...props
}: TextProps) {
    const [scope, animate] = useAnimate()
    const [blocked, setBlocked] = useState(false)

    const mergeTransition = (transition: AnimationOptions, i: number) => ({
        ...transition,
        delay: i * staggerDuration,
    })

    const shuffledIndices = Array.from(
        { length: label.length },
        (_, i) => i
    ).sort(() => Math.random() - 0.5)

    const hoverStart = debounce(() => {
        if (blocked) return
        setBlocked(true)

        for (let i = 0; i < label.length; i++) {
            const randomIndex = shuffledIndices[i]
            animate(`.letter-${randomIndex}`, { y: reverse ? "100%" : "-100%" }, mergeTransition(transition, i))
                .then(() => animate(`.letter-${randomIndex}`, { y: 0 }, { duration: 0 }))

            animate(`.letter-secondary-${randomIndex}`, { top: "0%" }, mergeTransition(transition, i))
                .then(() => animate(`.letter-secondary-${randomIndex}`, { top: reverse ? "-100%" : "100%" }, { duration: 0 }))
                .then(() => i === label.length - 1 && setBlocked(false))
        }
    }, 100)

    return (
        <motion.span
            className={`flex items-center justify-center relative overflow-hidden ${className}`}
            onHoverStart={hoverStart}
            onClick={onClick}
            ref={scope}
            {...props}
        >
            <span className="sr-only">{label}</span>
            {label.split("").map((letter, i) => (
                <span key={i} className="relative flex whitespace-pre">
                    <motion.span className={`pb-2 letter-${i}`}>{letter}</motion.span>
                    <motion.span
                        className={`absolute letter-secondary-${i}`}
                        aria-hidden
                        style={{ top: reverse ? "-100%" : "100%" }}
                    >
                        {letter}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    )
}

export function RandomLetterSwapPingPong(props: TextProps) {
    return <RandomLetterSwapForward {...props} />
}
