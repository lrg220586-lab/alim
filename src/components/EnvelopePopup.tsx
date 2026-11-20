import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface EnvelopePopupProps {
  onOpened: () => void;
  onClose: () => void;
}

export function EnvelopePopup({ onOpened, onClose }: EnvelopePopupProps) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !opening) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opening, onClose]);

  const handleOpenEnvelope = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      onOpened();
    }, 820);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F2E9]/88 backdrop-blur-[3px] p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="envelope-dialog-title"
    >
      {/* Close escape button */}
      {!opening && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close envelope popup"
          className="absolute top-6 right-6 sm:top-8 sm:right-12 p-2 rounded-full text-[#7C776D] hover:text-[#2C3130] hover:bg-[#EAE5D7] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152]"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <p
          id="envelope-dialog-title"
          className="font-editorial text-[20px] sm:text-[22px] text-[#2C3130] mb-6 text-center"
        >
          {opening ? 'opening your letter...' : 'a letter for alim'}
        </p>

        {/* Interactive Tactile Envelope */}
        <button
          type="button"
          onClick={handleOpenEnvelope}
          disabled={opening}
          aria-label="Tap to open the wax-sealed envelope"
          className="group relative w-[300px] sm:w-[348px] h-[206px] sm:h-[234px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#425152] rounded-[10px]"
          style={{ perspective: '1000px' }}
        >
          {/* Envelope Back Interior */}
          <div className="absolute inset-0 rounded-[10px] bg-[#E8E0CE] border border-[#D4CBB7] shadow-[0_20px_50px_rgba(44,49,48,0.14)]" />

          {/* Letter sliding out when opened */}
          <motion.div
            initial={{ y: 0, opacity: 0.92 }}
            animate={
              opening
                ? { y: -84, opacity: 1 }
                : { y: 0, opacity: 0.92 }
            }
            transition={{
              delay: opening ? 0.2 : 0,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-x-4 top-3 bottom-4 rounded-[4px] bg-[#FBF9F2] border border-[#EAE4D4] shadow-sm px-5 py-4 text-left overflow-hidden pointer-events-none"
          >
            <p className="font-handwritten text-[15px] text-[#3F4443] leading-relaxed">
              Today 19th November 2026, wanna say Happy International Men&apos;s day Alim...
            </p>
            <div className="mt-2.5 space-y-2 opacity-35">
              <div className="h-[1.5px] w-4/5 bg-[#9E9584] rounded" />
              <div className="h-[1.5px] w-3/4 bg-[#9E9584] rounded" />
              <div className="h-[1.5px] w-2/3 bg-[#9E9584] rounded" />
            </div>
          </motion.div>

          {/* Envelope Front Pocket (Left, Right, Bottom folds) */}
          <svg
            viewBox="0 0 348 234"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none rounded-[10px]"
            aria-hidden="true"
          >
            {/* Left fold */}
            <path d="M0 8L174 128L0 234V8Z" fill="#F4EFE2" stroke="#DDD5C2" strokeWidth="1" />
            {/* Right fold */}
            <path d="M348 8L174 128L348 234V8Z" fill="#EFE9DA" stroke="#DDD5C2" strokeWidth="1" />
            {/* Bottom fold */}
            <path d="M0 234L174 118L348 234H0Z" fill="#F9F5EA" stroke="#D8CFBC" strokeWidth="1.2" />
          </svg>

          {/* Envelope Top Flap (rotates open on click) */}
          <motion.div
            initial={false}
            animate={{ rotateX: opening ? 175 : 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-x-0 top-0 h-[138px] pointer-events-none z-20"
          >
            <svg
              viewBox="0 0 348 138"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_3px_6px_rgba(62,56,44,0.08)]"
              aria-hidden="true"
            >
              <path
                d="M2 2C2 0.9 2.9 0 4 0H344C345.1 0 346 0.9 346 2L174 132L2 2Z"
                fill="#FAF6EB"
                stroke="#D6CEBB"
                strokeWidth="1.2"
              />
            </svg>
          </motion.div>

          {/* Gold Wax Seal */}
          <motion.div
            initial={false}
            animate={
              opening
                ? { scale: 0.6, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-[116px] sm:top-[128px] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E7C072] via-[#D5A657] to-[#B8883C] shadow-[0_4px_12px_rgba(125,92,38,0.28)] border border-[#EED091]/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
              <div className="w-8 h-8 rounded-full border border-[#B08035]/40 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#FAF4E6"
                  aria-hidden="true"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </button>

        <p className="mt-6 text-[13px] text-[#7A756B]">
          {opening ? 'unfolding your note...' : 'tap the wax seal to open'}
        </p>
      </motion.div>
    </motion.div>
  );
}
