import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface LightboxModalProps {
  images: string[];
  initialIndex?: number;
  projectTitle: string;
  language: Language;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  initialIndex = 0,
  projectTitle,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  const isRtl = language === 'ar';
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const handlePrev = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `dusur-${projectTitle.toLowerCase().replace(/\s+/g, '-')}-img${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-fadeIn">
      {/* Top Bar Controls */}
      <div className="p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wider text-amber-400">
            {t.fullscreenGallery}
          </span>
          <span className="text-xs font-medium opacity-80 truncate max-w-[200px] sm:max-w-md">
            {projectTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            aria-label="Zoom out"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            aria-label="Zoom in"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all"
          >
            <ZoomIn size={16} />
          </button>

          {/* Download image */}
          <button
            onClick={handleDownloadImage}
            aria-label="Download image"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <Download size={16} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label={t.close}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-2">
        <img
          src={images[currentIndex]}
          alt={`${projectTitle} ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          style={{ transform: `scale(${scale})` }}
          className="max-h-[82vh] max-w-full object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing"
        />

        {/* Previous / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all border border-white/10 shadow-lg"
            >
              <PrevIcon size={22} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all border border-white/10 shadow-lg"
            >
              <NextIcon size={22} />
            </button>
          </>
        )}
      </div>

      {/* Bottom Counter & Thumbnails Bar */}
      <div className="p-4 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 to-transparent">
        <span className="text-xs text-white/80 font-mono tracking-wider">
          {t.imageOf
            .replace('{current}', String(currentIndex + 1))
            .replace('{total}', String(images.length))}
        </span>

        {/* Thumbnail strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full px-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setScale(1);
                setCurrentIndex(idx);
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                currentIndex === idx
                  ? 'border-amber-500 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt="thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
