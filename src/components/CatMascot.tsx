import { motion } from 'motion/react';

interface CatMascotProps {
  mood?: 'curious' | 'happy';
  size?: 'sm' | 'md' | 'lg';
  pulseKey?: number;
}

const SIZE_MAP = {
  sm: 74,
  md: 92,
  lg: 108,
};

export function CatMascot({ mood = 'curious', size = 'md', pulseKey = 0 }: CatMascotProps) {
  const px = SIZE_MAP[size];

  return (
    <motion.div
      key={pulseKey}
      initial={pulseKey > 0 ? { scale: 0.94, y: 2 } : false}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground shadow */}
        <ellipse cx="55" cy="108" rx="30" ry="6" fill="#DDD7C8" />

        {/* Curled tail */}
        <path
          d="M78 88C93 88 103 78 103 63C103 55 99 51 95 52C91 53 91 59 93 64C94 69 90 78 78 80"
          stroke="#3E4B4C"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Body */}
        <path
          d="M32 68C32 54 42 46 55 46C68 46 78 54 78 68V91C78 97 73 102 66 102H44C37 102 32 97 32 91V68Z"
          fill="#3E4B4C"
        />

        {/* White tummy */}
        <ellipse cx="55" cy="84" rx="15" ry="14" fill="#FAF7EF" />

        {/* Feet */}
        <ellipse cx="42" cy="101" rx="7" ry="4.5" fill="#2E3839" />
        <ellipse cx="68" cy="101" rx="7" ry="4.5" fill="#2E3839" />
        <ellipse cx="42" cy="101.5" rx="4.5" ry="2.5" fill="#FAF7EF" />
        <ellipse cx="68" cy="101.5" rx="4.5" ry="2.5" fill="#FAF7EF" />

        {/* Left Ear */}
        <path d="M29 36L27 14C27 11.5 30 10.5 32 12L46 25L29 36Z" fill="#3E4B4C" />
        <path d="M32 32L31 18L41 26L32 32Z" fill="#E8AEAE" />

        {/* Right Ear */}
        <path d="M81 36L83 14C83 11.5 80 10.5 78 12L64 25L81 36Z" fill="#3E4B4C" />
        <path d="M78 32L79 18L69 26L78 32Z" fill="#E8AEAE" />

        {/* Head */}
        <ellipse cx="55" cy="42" rx="27" ry="22" fill="#3E4B4C" />

        {/* Tuxedo white face mask */}
        <path
          d="M31 44C31 36 39 34 45 38C49 41 52 33 55 33C58 33 61 41 65 38C71 34 79 36 79 44C79 56 68 62 55 62C42 62 31 56 31 44Z"
          fill="#FAF7EF"
        />

        {/* Cheeks */}
        <ellipse cx="38.5" cy="49.5" rx="4.2" ry="2.6" fill="#F0B5B5" opacity="0.85" />
        <ellipse cx="71.5" cy="49.5" rx="4.2" ry="2.6" fill="#F0B5B5" opacity="0.85" />

        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            <path
              d="M39.5 44.5C40.5 41.5 44.5 41.5 45.5 44.5"
              stroke="#2C3536"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M64.5 44.5C65.5 41.5 69.5 41.5 70.5 44.5"
              stroke="#2C3536"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="42.5" cy="43.5" r="3.4" fill="#2C3536" />
            <circle cx="41.4" cy="42.3" r="1.15" fill="#FFFFFF" />
            <circle cx="67.5" cy="43.5" r="3.4" fill="#2C3536" />
            <circle cx="66.4" cy="42.3" r="1.15" fill="#FFFFFF" />
          </>
        )}

        {/* Nose & cat mouth */}
        <path d="M53.2 47.5H56.8L55 49.4L53.2 47.5Z" fill="#E19C9C" />
        <path
          d="M50.5 50.5C52 52.2 54.2 51.8 55 49.8C55.8 51.8 58 52.2 59.5 50.5"
          stroke="#3E4B4C"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Envelope */}
        <g>
          <rect
            x="38"
            y="66"
            width="34"
            height="24"
            rx="3.5"
            fill="#F9F4E8"
            stroke="#ABA290"
            strokeWidth="1.5"
          />
          <path
            d="M39.5 67.5L55 79.5L70.5 67.5"
            stroke="#ABA290"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gold wax seal */}
          <circle cx="55" cy="78.5" r="4.5" fill="#D5A657" />
          <circle cx="54.2" cy="77.7" r="1.4" fill="#EAC784" />
        </g>

        {/* Paws holding the envelope */}
        <ellipse cx="37.5" cy="77" rx="4.2" ry="3.2" fill="#FAF7EF" stroke="#3E4B4C" strokeWidth="1.4" />
        <ellipse cx="72.5" cy="77" rx="4.2" ry="3.2" fill="#FAF7EF" stroke="#3E4B4C" strokeWidth="1.4" />
      </svg>
    </motion.div>
  );
}
