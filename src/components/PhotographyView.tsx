import React, { useState } from 'react';
import { PHOTO_GALLERY, PhotoEntry } from '../data/literaryData';
import { PhotoArtCard, PhotoLightbox } from './PhotoLightbox';
import { Camera, Sparkles } from 'lucide-react';

interface PhotographyViewProps {
  onShareQuote: (quote: string, source: string) => void;
}

export const PhotographyView: React.FC<PhotographyViewProps> = ({ onShareQuote }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-ui space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d66872] mb-2 uppercase tracking-widest">
          <Camera className="w-3.5 h-3.5" />
          <span>দৃশ্যপট ও আলোছায়া</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-amber-500 dark:text-yellow-400">
          মাই ফটোগ্রাফি · My Photography
        </h1>
        <p className="font-literary text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          ক্যামেরার লেন্সে ধরা পড়া কিছু নির্জন মুহূর্ত, বৃষ্টিভেজা রাস্তা আর পুরোনো দিনের না-বলা দৃশ্যমালা।
        </p>
      </div>

      {/* Masonry / Bento Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {PHOTO_GALLERY.map((photo) => (
          <PhotoArtCard
            key={photo.id}
            photo={photo}
            onClick={(p) => setSelectedPhoto(p)}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onShareQuote={onShareQuote}
      />
    </div>
  );
};
