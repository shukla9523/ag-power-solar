'use client';

import Image from 'next/image';

export default function FilmstripBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Image /background.jpg */}
      <Image
        src="/background.webp"
        alt="Background Pattern"
        fill
        priority
        sizes="100vw"
        className="w-full h-full object-cover opacity-50 absolute inset-0"
      />
      {/* Soft gradient fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />
    </div>
  );
}

