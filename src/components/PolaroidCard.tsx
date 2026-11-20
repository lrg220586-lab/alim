import { useState } from 'react';
import { Camera } from 'lucide-react';

interface PolaroidCardProps {
  photoSrc: string;
  caption?: string;
  onAddPhotoClick: () => void;
}

export function PolaroidCard({
  photoSrc,
  caption = 'little alim',
  onAddPhotoClick,
}: PolaroidCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative pt-3 select-none">
      {/* Washi masking tape strip */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[68px] h-[22px] bg-[#E2DAC7]/80 border border-[#D4CCB8]/50 shadow-[0_1px_3px_rgba(44,49,48,0.08)]"
      />

      {/* Tilted Polaroid Frame */}
      <div className="relative bg-white p-3.5 pb-4 w-[240px] sm:w-[252px] shadow-[0_12px_32px_rgba(44,49,48,0.09)] border border-[#EEEAE0] -rotate-2 transition-transform duration-300 hover:rotate-0">
        {/* Inner Photo Viewport */}
        <div className="relative w-full aspect-[1/0.96] bg-[#EAE5D8] overflow-hidden">
          {!imgError ? (
            <img
              src={photoSrc}
              alt={caption}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EAE4D5] to-[#DCD4C0] text-[#7B766B]">
              <Camera className="w-6 h-6 opacity-60" />
              <span className="text-xs font-medium">add a photo</span>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Margin */}
        <div className="mt-3 flex items-center justify-between gap-2 px-0.5">
          <span className="font-handwritten text-[19px] leading-none text-[#4A4945] italic tracking-tight">
            {caption}
          </span>

          <button
            type="button"
            onClick={onAddPhotoClick}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-[#848078] hover:text-[#2C3130] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#425152] rounded px-1 py-0.5"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            <span>add photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
