import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { BubbleWrapGrid } from './components/BubbleWrapGrid';
import { CatMascot } from './components/CatMascot';
import { EnvelopePopup } from './components/EnvelopePopup';
import { NoteCard } from './components/NoteCard';
import { PolaroidCard } from './components/PolaroidCard';
import { soundEngine } from './utils/audio';

type Stage = 'POPPING' | 'COMPLETED' | 'OPENED';

const BUBBLE_COUNT = 20;
const DEFAULT_PHOTO_URL = '/assets/aistudio/WhatsApp_Image_2026-11-20_at_4.41.56_PM_7e127371.jpeg';
const PHOTO_STORAGE_KEY = 'special_delivery_alim_photo';
const REACTIONS_STORAGE_KEY = 'special_delivery_alim_reactions';

function MusicUploadIcon() {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M7 13.5V4.2L13 3V12.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.2" cy="13.8" r="1.9" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11.2" cy="12.5" r="1.9" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M16.8 11V4.5M16.8 4.5L14.8 6.5M16.8 4.5L18.8 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [stage, setStage] = useState<Stage>('POPPING');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [popped, setPopped] = useState<boolean[]>(() => Array(BUBBLE_COUNT).fill(false));
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [trackName, setTrackName] = useState('sparks');
  const [muted, setMuted] = useState(false);
  const musicManuallyToggledRef = useRef(false);

  const [photoSrc, setPhotoSrc] = useState<string>(() => {
    try {
      return localStorage.getItem(PHOTO_STORAGE_KEY) || DEFAULT_PHOTO_URL;
    } catch {
      return DEFAULT_PHOTO_URL;
    }
  });

  const [starred, setStarred] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(REACTIONS_STORAGE_KEY);
      return saved ? Boolean(JSON.parse(saved).starred) : false;
    } catch {
      return false;
    }
  });

  const [hearted, setHearted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(REACTIONS_STORAGE_KEY);
      return saved ? Boolean(JSON.parse(saved).hearted) : false;
    } catch {
      return false;
    }
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const completionTimerRef = useRef<number | null>(null);

  const popCount = popped.filter(Boolean).length;

  useEffect(() => {
    try {
      localStorage.setItem(
        REACTIONS_STORAGE_KEY,
        JSON.stringify({ starred, hearted }),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [starred, hearted]);

  useEffect(() => {
    return () => {
      if (completionTimerRef.current !== null) {
        window.clearTimeout(completionTimerRef.current);
      }
      soundEngine.stopMusic();
    };
  }, []);

  const handlePop = useCallback((index: number) => {
    setPopped((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      soundEngine.playPop();

      const nextCount = next.filter(Boolean).length;
      if (nextCount === BUBBLE_COUNT) {
        if (completionTimerRef.current !== null) {
          window.clearTimeout(completionTimerRef.current);
        }
        completionTimerRef.current = window.setTimeout(() => {
          soundEngine.playMissionComplete();
          setStage('COMPLETED');
        }, 420);
      }
      return next;
    });
  }, []);

  const handleOpenNoteClick = () => {
    soundEngine.playEnvelopePopup();
    setEnvelopeOpen(true);
  };

  const handleEnvelopeOpened = async () => {
    soundEngine.playOpenNote();
    setEnvelopeOpen(false);
    setStage('OPENED');
    if (!muted && !musicPlaying && !musicManuallyToggledRef.current) {
      const started = await soundEngine.startMusic();
      if (started) {
        setMusicPlaying(true);
      }
    }
  };

  const handleReplay = () => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setEnvelopeOpen(false);
    setPopped(Array(BUBBLE_COUNT).fill(false));
    setStage('POPPING');
  };

  const handleToggleMusic = async () => {
    musicManuallyToggledRef.current = true;
    const playing = await soundEngine.toggleMusic();
    setMusicPlaying(playing);
  };

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setPhotoSrc(result);
      try {
        localStorage.setItem(PHOTO_STORAGE_KEY, result);
      } catch {
        // Large files may exceed localStorage quota; still works in current session
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleMusicUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').trim() || 'custom track';
    setTrackName(cleanName);
    soundEngine.setCustomTrack(objectUrl);
    setMusicPlaying(true);
    e.target.value = '';
  };

  const handleToggleStar = () => {
    setStarred((prev) => {
      const next = !prev;
      soundEngine.playSparkle(next);
      return next;
    });
  };

  const handleToggleHeart = () => {
    setHearted((prev) => {
      const next = !prev;
      soundEngine.playSparkle(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2E9] text-[#2C3130]">
      {/* Hidden file pickers */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        aria-label="Choose a Polaroid photo"
      />
      <input
        ref={musicInputRef}
        type="file"
        accept="audio/*"
        onChange={handleMusicUpload}
        className="hidden"
        aria-label="Upload background audio"
      />

      {/* Top Header */}
      <header className="w-full max-w-[1360px] mx-auto px-6 sm:px-14 py-6 flex items-center justify-between gap-6">
        <span className="font-editorial text-[19px] sm:text-[20px] tracking-[-0.01em] text-[#2C3130] whitespace-nowrap shrink-0">
          special delivery
        </span>

        <div className="flex items-center gap-4 sm:gap-6 text-[13px] text-[#66635C]">
          <button
            type="button"
            onClick={() => void handleToggleMusic()}
            aria-label={musicPlaying ? `Pause ${trackName}` : `Play ${trackName}`}
            className="inline-flex items-center gap-1.5 hover:text-[#2C3130] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] rounded px-1.5 py-1"
          >
            {musicPlaying ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span className="max-w-[110px] truncate">{trackName}</span>
          </button>

          <button
            type="button"
            onClick={() => musicInputRef.current?.click()}
            title="Upload music track"
            aria-label="Upload custom background music"
            className="inline-flex items-center justify-center hover:text-[#2C3130] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] rounded p-1.5"
          >
            <MusicUploadIcon />
          </button>

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 hover:text-[#2C3130] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] rounded px-1.5 py-1"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            <span>change photo</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            aria-pressed={muted}
            className="inline-flex items-center justify-center hover:text-[#2C3130] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] rounded p-1.5"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-[#9A958A]" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 pt-4">
        <AnimatePresence mode="wait">
          {stage === 'POPPING' && (
            <motion.section
              key="popping"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full max-w-[760px]"
            >
              <h1 className="font-editorial text-[34px] sm:text-[40px] leading-[1.2] tracking-[-0.015em] text-[#2C3130] text-center text-balance">
                a parcel for alim
              </h1>
              <p className="mt-2 text-[14px] text-[#78746C] text-center">
                pop every bubble to unlock your parcel.
              </p>

              <div className="mt-10 sm:mt-12 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
                <div className="flex flex-col items-center">
                  <CatMascot mood="curious" size="md" pulseKey={popCount} />
                  <p className="mt-2.5 text-[13px] text-[#6E6A62] tabular-nums whitespace-nowrap">
                    {popCount} / {BUBBLE_COUNT} popped
                  </p>
                </div>

                <BubbleWrapGrid popped={popped} onPop={handlePop} />
              </div>
            </motion.section>
          )}

          {stage === 'COMPLETED' && (
            <motion.section
              key="completed"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center max-w-[540px]"
            >
              <CatMascot mood="happy" size="lg" />
              <h1 className="mt-5 font-editorial text-[26px] sm:text-[31px] leading-[1.3] tracking-[-0.01em] text-[#2C3130] text-balance">
                mission completed. delivery for alim.
              </h1>
              <button
                type="button"
                onClick={handleOpenNoteClick}
                className="mt-6 px-6 py-3 rounded-[10px] bg-[#425152] hover:bg-[#354243] active:scale-[0.98] text-white text-[14px] font-medium shadow-[0_8px_20px_rgba(66,81,82,0.22)] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152]"
              >
                open your note
              </button>
            </motion.section>
          )}

          {stage === 'OPENED' && (
            <motion.section
              key="opened"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[920px] flex flex-col items-center"
            >
              <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
                <div className="flex flex-col items-center gap-7 shrink-0">
                  <PolaroidCard
                    key={photoSrc}
                    photoSrc={photoSrc}
                    onAddPhotoClick={() => photoInputRef.current?.click()}
                  />
                  <CatMascot mood="happy" size="sm" />
                </div>

                <NoteCard
                  starred={starred}
                  hearted={hearted}
                  onToggleStar={handleToggleStar}
                  onToggleHeart={handleToggleHeart}
                />
              </div>

              <footer className="mt-10 flex flex-col items-center gap-3.5 text-center">
                <p className="text-[12.5px] italic text-[#7B776F]">
                  delivered with care. no refunds, no exchanges.
                </p>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#FAF8F2] hover:bg-white border border-[#E2DDD0] text-[13px] text-[#56534C] shadow-[0_2px_6px_rgba(44,49,48,0.04)] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152]"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>replay</span>
                </button>
              </footer>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Envelope Pop-up before Note Reveal */}
      <AnimatePresence>
        {envelopeOpen && (
          <EnvelopePopup
            onOpened={() => void handleEnvelopeOpened()}
            onClose={() => setEnvelopeOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
