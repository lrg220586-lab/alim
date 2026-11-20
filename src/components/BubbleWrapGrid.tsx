import { useRef } from 'react';

interface BubbleWrapGridProps {
  popped: boolean[];
  onPop: (index: number) => void;
}

export function BubbleWrapGrid({ popped, onPop }: BubbleWrapGridProps) {
  const draggingRef = useRef(false);

  return (
    <div
      className="relative rounded-[20px] bg-[#E8E3D4] p-5 sm:p-6 shadow-[0_16px_38px_rgba(74,66,50,0.09)] border border-[#DFD9C8] select-none"
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
      }}
      role="group"
      aria-label="Bubble wrap parcel cover"
    >
      <div className="grid grid-cols-5 gap-3.5 sm:gap-4">
        {popped.map((isPopped, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isPopped}
            onPointerDown={() => {
              draggingRef.current = true;
              if (!isPopped) {
                onPop(idx);
              }
            }}
            onPointerEnter={() => {
              if (draggingRef.current && !isPopped) {
                onPop(idx);
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isPopped) {
                e.preventDefault();
                onPop(idx);
              }
            }}
            aria-label={`Bubble ${idx + 1}${isPopped ? ', popped' : ', ready to pop'}`}
            aria-pressed={isPopped}
            className={`relative w-12 h-12 sm:w-[54px] sm:h-[54px] rounded-full transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] ${
              isPopped
                ? 'bubble-popped cursor-default scale-[0.95]'
                : 'bubble-dome cursor-pointer hover:scale-[1.04] active:scale-[0.92]'
            }`}
          >
            {!isPopped ? (
              <>
                {/* Crisp top-left specular crescent highlight */}
                <span
                  aria-hidden="true"
                  className="absolute top-[7px] left-[9px] w-[14px] h-[9px] rounded-full bg-white/90 blur-[0.4px] -rotate-25 pointer-events-none"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-[16px] left-[7px] w-[5px] h-[5px] rounded-full bg-white/75 pointer-events-none"
                />
              </>
            ) : (
              <>
                {/* Subtle crinkle crease lines inside popped bubble */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 48 48"
                  className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                >
                  <path
                    d="M14 19C18 22 22 20 26 24C29 27 33 25 35 28"
                    stroke="#A39B88"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M17 31C21 28 24 30 29 24"
                    stroke="#B8B09E"
                    strokeWidth="1"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Momentary pop ripple */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-white/80 animate-pop-ring pointer-events-none"
                />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
