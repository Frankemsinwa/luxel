'use client'

import { Check, Clock, CreditCard, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingStatusHeaderProps {
    currentStep: 1 | 2 | 3 | 4 | 5;
}

export default function BookingStatusHeader({ currentStep }: BookingStatusHeaderProps) {
    const steps = [
        {
            id: 1,
            label: "Request Received",
            activeLabel: "Request Received",
            completedLabel: "Request Received",
            icon: <Check size={16} strokeWidth={3} />
        },
        {
            id: 2,
            label: "Agent Confirming",
            activeLabel: "Agent Confirming",
            completedLabel: "Agent Confirmed",
            icon: <Clock size={16} strokeWidth={3} />
        },
        {
            id: 3,
            label: "Payment",
            activeLabel: "Waiting for Payment",
            completedLabel: "Payment Received",
            icon: <CreditCard size={16} />
        },
        {
            id: 4,
            label: "Finalized",
            activeLabel: "Issuing Tickets",
            completedLabel: "Trip Finalized",
            icon: <CheckCircle2 size={16} />
        }
    ];

    return (
        <div className="max-w-5xl mx-auto w-full py-16 px-8 select-none">
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-zinc-100 z-0 rounded-full" />

                {/* Active Progress Line */}
                <motion.div
                    className="absolute top-5 left-0 h-[2px] bg-amber z-0 rounded-full origin-left"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    <motion.div
                        animate={{ x: ['0%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                </motion.div>

                <div className="relative flex items-center justify-between">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        const isPending = currentStep < step.id;

                        // special case for step 2 label in Agent Confirmed page
                        // We will actually rely on the page passing the correct step or state.
                        // But for now, let's use the logic: if currentStep is 3, step 2 is definitely completed.

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                {/* Step Circle */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: isCompleted ? "#F59E0B" : isActive ? "#F59E0B" : "#F4F4F5",
                                        scale: isActive ? 1.15 : 1,
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${isCompleted || isActive ? 'text-white' : 'text-zinc-400'
                                        } ${isActive ? 'ring-[8px] ring-amber/10 shadow-lg shadow-amber/20' : 'ring-0'}`}
                                >
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {isCompleted ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="icon"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className={isActive ? "animate-pulse" : ""}
                                                >
                                                    {step.icon}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Step Label */}
                                <div className="mt-6 flex flex-col items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-zinc-900' : 'text-zinc-400'
                                        }`}>
                                        {isActive ? step.activeLabel : isCompleted ? step.completedLabel : step.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-dot"
                                            className="w-1 h-1 bg-amber rounded-full mt-2"
                                        />
                                    )}
                                </div>

                                {/* Hover Tooltip (Professional touch) */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[9px] font-bold py-2 px-4 rounded-xl pointer-events-none whitespace-nowrap tracking-widest uppercase">
                                    Step {step.id}: {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
