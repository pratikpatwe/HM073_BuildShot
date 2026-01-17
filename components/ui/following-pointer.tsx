"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export const FollowerPointerCard = ({
    children,
    className,
    title,
}: {
    children: React.ReactNode
    className?: string
    title?: string | React.ReactNode
}) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const ref = React.useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isInside, setIsInside] = useState<boolean>(false)

    useEffect(() => {
        // Check for mobile/touch devices
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        // Reset inside state if window loses focus to prevent ghosting
        const handleWindowBlur = () => setIsInside(false)
        window.addEventListener("blur", handleWindowBlur)

        return () => {
            window.removeEventListener("resize", checkMobile)
            window.removeEventListener("blur", handleWindowBlur)
        }
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return

        const target = e.target as HTMLElement
        const shouldHide =
            target.tagName === "TEXTAREA" ||
            target.tagName === "INPUT" ||
            target.tagName === "BUTTON" ||
            target.closest("[data-no-pointer]")

        if (shouldHide) {
            setIsInside(false)
            return
        }

        if (!isInside) setIsInside(true)
        x.set(e.clientX)
        y.set(e.clientY)
    }

    const handleMouseLeave = () => {
        setIsInside(false)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return

        const target = e.target as HTMLElement
        const shouldHide =
            target.tagName === "TEXTAREA" ||
            target.tagName === "INPUT" ||
            target.tagName === "BUTTON" ||
            target.closest("[data-no-pointer]")

        if (!shouldHide) {
            setIsInside(true)
        }
    }

    return (
        <div
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            style={{
                cursor: !isMobile && isInside ? "none" : "auto",
            }}
            ref={ref}
            className={cn("relative", className)}
        >
            <AnimatePresence>
                {!isMobile && isInside && <FollowPointer x={x} y={y} title={title} />}
            </AnimatePresence>
            {children}
        </div>
    )
}

export const FollowPointer = ({
    x,
    y,
    title,
}: {
    x: MotionValue<number>
    y: MotionValue<number>
    title?: string | React.ReactNode
}) => {
    return (
        <motion.div
            className="fixed z-[99999] pointer-events-none"
            style={{
                top: y,
                left: x,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
            }}
            initial={{
                scale: 0,
                opacity: 0,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            exit={{
                scale: 0,
                opacity: 0,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
        >
            <div className="flex items-center pointer-events-none">
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="1"
                    viewBox="0 0 16 16"
                    className="h-6 w-6 -rotate-[70deg] transform stroke-emerald-400 text-emerald-500 drop-shadow-lg pointer-events-none"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
                </svg>
                <motion.div
                    style={{
                        background: "linear-gradient(135deg, #00C853 0%, #1DB954 100%)",
                    }}
                    initial={{
                        scale: 0.5,
                        opacity: 0,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    exit={{
                        scale: 0.5,
                        opacity: 0,
                    }}
                    className="ml-2 min-w-max rounded-full px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg border border-white/20 pointer-events-none"
                >
                    {title || `Kairos Feature`}
                </motion.div>
            </div>
        </motion.div>
    )
}
