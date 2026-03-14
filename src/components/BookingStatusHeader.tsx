'use client'

import { Check, Clock, CreditCard, CheckCircle2, FileSearch } from "lucide-react";
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
            icon: <Check size={14} strokeWidth={3} />
        },
        {
            id: 2,
            label: "Agent Verifying",
            activeLabel: "Agent Verifying",
            completedLabel: "Agent Confirmed",
            icon: <Clock size={14} strokeWidth={3} />
        },
        {
            id: 3,
            label: "Confirmed",
            activeLabel: "Availability Confirmed",
            completedLabel: "Availability Confirmed",
            icon: <CheckCircle2 size={14} />
        },
        {
            id: 4,
            label: "Payment",
            activeLabel: "Awaiting Payment",
            completedLabel: "Payment Received",
            icon: <CreditCard size={14} />
        },
        {
            id: 5,
            label: "Finalized",
            activeLabel: "Issuing Tickets",
            completedLabel: "Trip Finalized",
            icon: <FileSearch size={14} />
        }
    ];

    // Height of the circle: 32px mobile, 40px desktop. Center = 16px / 20px.
    const CIRCLE_SIZE_MOBILE = 32; // w-8 = 32px
    const CIRCLE_SIZE_DESKTOP = 40; // w-10 = 40px
    const LINE_TOP_MOBILE = CIRCLE_SIZE_MOBILE / 2; // 16px
    const LINE_TOP_DESKTOP = CIRCLE_SIZE_DESKTOP / 2; // 20px

    return (
        <div className="max-w-5xl mx-auto w-full py-8 md:py-16 px-4 md:px-8 pt-32 md:pt-40 select-none">
            <div className="relative">
                {/* Background Line - positioned at exact vertical center of circles */}
                <div
                    className="absolute left-0 w-full h-[2px] bg-black/10 z-0 rounded-full"
                    style={{ top: `${LINE_TOP_MOBILE}px` }}
                />
                {/* Desktop override for line position */}
                <style>{`
                    @media (min-width: 768px) {
                        .status-line-bg, .status-line-active { top: ${LINE_TOP_DESKTOP}px !important; }
                    }
                `}</style>

                {/* Active Progress Line */}
                <motion.div
                    className="absolute left-0 h-[2px] bg-black z-0 rounded-full origin-left status-line-active"
                    style={{ top: `${LINE_TOP_MOBILE}px` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    <motion.div
                        animate={{ x: ['0%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber/40 to-transparent"
                    />
                </motion.div>

                {/* Step circles are in a flex row. Each circle has a fixed size so they all align on the same baseline. */}
                <div className="relative flex items-start justify-between">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                {/* Step Circle - fixed height ensures alignment */}
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 shadow-sm ${
                                        isCompleted || isActive
                                            ? 'bg-black text-amber'
                                            : 'bg-zinc-100 text-black/30'
                                    } ${isActive ? 'ring-[6px] md:ring-[8px] ring-black/10 shadow-lg shadow-black/20' : 'ring-0'}`}
                                >
                                    <AnimatePresence mode="wait">
                                        {isCompleted ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                            >
                                                <Check size={16} strokeWidth={3} />
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

                                {/* Step Label */}
                                <div className="mt-3 md:mt-5 flex flex-col items-center w-[56px] md:w-auto">
                                    <span className={`text-[7px] md:text-[10px] font-semibold uppercase tracking-[0.08em] md:tracking-[0.15em] transition-colors duration-500 text-center leading-tight ${
                                        isActive ? 'text-black' : 'text-black/40'
                                    } ${!isActive ? 'hidden md:block' : ''}`}>
                                        {isActive ? step.activeLabel : isCompleted ? step.completedLabel : step.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-dot"
                                            className="w-1 h-1 bg-black rounded-full mt-1.5 md:mt-2"
                                        />
                                    )}
                                </div>

                                {/* Hover Tooltip - Hidden on mobile */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-amber text-black text-[10px] font-semibold py-2 px-4 rounded-xl pointer-events-none whitespace-nowrap tracking-widest uppercase hidden md:block">
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
