'use client'

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface CalendarDropdownProps {
  label: string;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export default function CalendarDropdown({ label, selectedDate, onSelectDate }: CalendarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.body.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDayClick = (date: Date) => {
    onSelectDate(date);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-zinc-200 hover:bg-white/80 hover:shadow-sm ${isOpen ? 'bg-white shadow-md border-zinc-200' : ''}`}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isOpen ? 'bg-amber text-white ring-4 ring-amber/10' : 'bg-zinc-50 text-zinc-400 group-hover:bg-amber group-hover:text-white group-hover:scale-110'}`}>
          <CalendarIcon size={18} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 font-bold mb-0.5">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold transition-colors ${selectedDate ? 'text-zinc-900' : 'text-zinc-500'}`}>
              {selectedDate ? format(selectedDate, 'EEE, dd MMM') : 'Add date'}
            </span>
            <ChevronRight
              size={12}
              className={`text-amber transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 z-50 p-6 min-w-[340px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-900 font-bold text-lg">Select Date</h3>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <style jsx global>{`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: var(--amber);
                --rdp-background-color: var(--amber-light);
                margin: 0;
              }
              .rdp-day_selected {
                background-color: var(--amber) !important;
                color: white !important;
                font-weight: bold;
                border-radius: 12px !important;
                box-shadow: 0 4px 10px rgba(241, 188, 50, 0.3);
              }
              .rdp-day:hover:not(.rdp-day_selected) {
                background-color: #fef3c7 !important;
                color: #92400e !important;
                border-radius: 12px;
              }
              .rdp-day_today {
                font-weight: 800;
                color: var(--amber);
              }
              .rdp-nav_button {
                color: #71717a;
                border-radius: 10px;
                transition: all 0.2s;
              }
              .rdp-nav_button:hover {
                background-color: #f4f4f5;
                color: black;
              }
              .rdp-head_cell {
                font-size: 0.75rem;
                font-weight: 600;
                color: #a1a1aa;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
            `}</style>

            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && handleDayClick(date)}
              showOutsideDays
              components={{
                Chevron: ({ orientation }) => orientation === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
              }}
            />

            {selectedDate && (
              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Departure</p>
                  <p className="text-sm font-bold text-zinc-900">{format(selectedDate, 'MMM dd, yyyy')}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
