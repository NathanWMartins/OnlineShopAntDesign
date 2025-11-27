import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    open: boolean;
    onClose: () => void;
    truckSrc?: string;
    text?: string;
    duration?: number;
};

export default function PurchaseAnimation({
    open,
    onClose,
    truckSrc,
    text = "Produto(s) a caminho",
    duration = 3,
}: Props) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const content = (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(1px)",
                    }}
                >
                    {/* container */}
                    <div
                        style={{
                            position: "relative",
                            width: "min(1100px, 92vw)",
                            height: 240,
                        }}
                    >
                        {/* estrada */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 84,
                                height: 48,
                                background: "linear-gradient(#3b3b3b,#2f2f2f)",
                                borderRadius: 8,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.25) inset",
                                overflow: "hidden",
                            }}
                        >
                            {/* faixas */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 3,
                                    height: 4,
                                    background: "rgba(255,255,255,0.8)",
                                    opacity: 0.7,
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 3,
                                    height: 4,
                                    background: "rgba(255,255,255,0.8)",
                                    opacity: 0.7,
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    left: 12,
                                    right: 12,
                                    top: "50%",
                                    height: 4,
                                    transform: "translateY(-50%)",
                                    background:
                                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0 40px, transparent 40px 80px)",
                                    borderRadius: 2,
                                    opacity: 0.9,
                                }}
                            />
                        </div>

                        <motion.div
                            key="truck"
                            initial={{ x: "-20vw", opacity: 1 }}
                            animate={{ x: "120vw", opacity: 1 }}
                            transition={{ duration, ease: "easeInOut" }}
                            onAnimationComplete={onClose}
                            style={{
                                position: "absolute",
                                top: 84 + 24 - 25,
                                height: 50,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                willChange: "transform",
                                textShadow: "0 4px 8px rgba(0,0,0,0.5)",
                            }}
                        >
                            <img
                                src={truckSrc}
                                alt="Delivery"
                                style={{
                                    width: 105,
                                    height: 70,
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.6))",
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.35 }}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                textAlign: "center",
                                color: "white",
                                fontSize: "clamp(18px, 3.2vw, 34px)",
                                fontWeight: 800,
                                textShadow: "0 3px 12px rgba(0,0,0,0.45)",
                                letterSpacing: 0.4,
                            }}
                        >
                            {text}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
