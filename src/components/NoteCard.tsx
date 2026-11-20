import { motion } from 'motion/react';
import { Heart, Star } from 'lucide-react';

interface NoteCardProps {
  starred: boolean;
  hearted: boolean;
  onToggleStar: () => void;
  onToggleHeart: () => void;
}

export function NoteCard({
  starred,
  hearted,
  onToggleStar,
  onToggleHeart,
}: NoteCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="note-paper-texture relative w-full max-w-[540px] rounded-[4px] border border-[#EBE6D8] shadow-[0_14px_38px_rgba(44,49,48,0.06)] px-7 py-8 sm:px-11 sm:py-10"
    >
      <div className="font-handwritten text-[17px] sm:text-[18.5px] leading-[1.82] text-[#2D3130] space-y-6">
        <p>
          Today 19th November 2026, wanna say Happy International Men&apos;s day
          Alim, I hope the little boy in this picture gets to grow up knowing
          that life isn&apos;t always about being strong, getting things right,
          or figuring everything out. Sometimes it&apos;s just about having fun,
          being a little stupid, laughing at things that shouldn&apos;t be
          funny, and enjoying whatever the day brings.
        </p>

        <p>
          Don&apos;t be too hard on him, Alim. He&apos;s just a boy trying to
          figure things out too.
        </p>

        <p className="pt-1">~Yati</p>
      </div>

      {/* Bottom-right reaction icons */}
      <div className="mt-6 flex items-center justify-end gap-3.5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.84 }}
          onClick={onToggleStar}
          aria-label={starred ? 'Remove star' : 'Star this note'}
          aria-pressed={starred}
          className="p-2 rounded-full text-[#9D9482] hover:text-[#C8963E] hover:bg-[#F2EDE0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152]"
        >
          <Star
            className={`w-[18px] h-[18px] transition-colors ${
              starred ? 'fill-[#D4A455] text-[#D4A455]' : ''
            }`}
          />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.84 }}
          onClick={onToggleHeart}
          aria-label={hearted ? 'Unlike this note' : 'Heart this note'}
          aria-pressed={hearted}
          className="p-2 rounded-full text-[#9D9482] hover:text-[#C95E5E] hover:bg-[#F2EDE0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152]"
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${
              hearted ? 'fill-[#D46A6A] text-[#D46A6A]' : ''
            }`}
          />
        </motion.button>
      </div>
    </motion.article>
  );
}
