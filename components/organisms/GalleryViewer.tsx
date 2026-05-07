"use client";

interface GalleryViewerProps {
  images?: string[];
}

export function GalleryViewer({ images }: GalleryViewerProps) {
  // Use dummy images if none provided to showcase the feature
  const displayImages = images && images.length > 0 ? images : [
    "https://picsum.photos/800/1000?random=1",
    "https://picsum.photos/1000/800?random=2",
    "https://picsum.photos/800/1200?random=3",
    "https://picsum.photos/1000/1000?random=4",
    "https://picsum.photos/800/800?random=5",
    "https://picsum.photos/1200/800?random=6",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-[var(--color-primary-dark)] tracking-[0.2em] text-xs font-semibold uppercase mb-4">Galeri Foto</p>
        <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text)]">Momen Indah Kami</h2>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {displayImages.map((src, idx) => (
          <div key={idx} className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm border border-[var(--color-border)]">
            <img
              src={src}
              alt={`Gallery image ${idx + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[var(--color-primary-dark)] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
