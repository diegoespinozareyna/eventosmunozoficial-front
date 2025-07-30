// src/components/TicketLoader.tsx
// components/TicketLoaderMotion.tsx
import { motion } from "framer-motion";
import { TicketPercent } from "lucide-react";
import { FaTicketAlt } from "react-icons/fa";

export default function TicketLoaderMotion() {
    return (
        <div
            className="fixed inset-0 bg-white flex items-center justify-center z-[9999]"
            style={{ transform: "scale(2.5)" }}
        >
            <motion.div
                initial={{ y: 0, rotate: 0 }}
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 15, -15, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="text-[4rem] text-[#22c55e]"
            >
                <TicketPercent />
            </motion.div>
        </div>
    );
}