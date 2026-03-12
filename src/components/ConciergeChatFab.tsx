'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { readTracker } from '@/lib/bookingTracker';
import { supabase } from '@/lib/supabase';

export default function ConciergeChatFab() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasBooking, setHasBooking] = useState(false);

  useEffect(() => {
    const t = readTracker();
    setHasBooking(Boolean(t?.requestId));
  }, [pathname]);

  const startChat = async () => {
    setIsStarting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/auth?mode=login&redirect=${redirect}`);
        return;
      }

      const tracker = readTracker();
      const requestId = tracker?.requestId || null;

      const response = await api.post('/chat/rooms', { requestId });
      const roomId = response.data.id;
      window.open(`/chat?room=${roomId}`, '_blank');
      setOpen(false);
    } catch (e) {
      console.error('Failed to start chat:', e);
      alert('Could not initialize concierge chat. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[110] rounded-3xl bg-white text-black border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors max-w-[92vw]"
        aria-label="Open concierge chat"
      >
        <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center">
          <MessageSquare size={18} />
        </div>
        <div className="text-left min-w-0">
          <div className="text-body-sm font-medium leading-tight truncate">Concierge Chat</div>
          <div className="text-caption text-black/60 truncate">
            {hasBooking ? 'Ask about your booking' : 'General help'}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[115] bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: -420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -420, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed left-4 bottom-4 z-[116] w-[min(420px,calc(100vw-2rem))] rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] border border-black/10 overflow-hidden"
              role="dialog"
              aria-label="Concierge chat panel"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-heading-sm font-medium text-black">Chat with concierge</div>
                    <div className="text-body-sm text-black/60 mt-1">
                      For security, chat requires login. Booking is still available without login.
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-black transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-black/[0.03] border border-black/5 p-4">
                  <div className="text-body-sm text-black/70">
                    {hasBooking ? 'We will attach your latest booking request to this chat.' : 'Start a general support chat.'}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={startChat}
                    className="flex-1 px-4 py-3 rounded-2xl bg-black text-white hover:bg-black/90 text-body-sm font-medium transition-colors flex items-center justify-center gap-2"
                    disabled={isStarting}
                  >
                    {isStarting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    Start chat
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

