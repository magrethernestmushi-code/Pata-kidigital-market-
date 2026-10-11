"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images.length > 0 ? images : ["https://picsum.photos/seed/pk-placeholder/800/800"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white card">
        <Image
          src={safeImages[active]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover"
          priority
        />
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                active === i ? "border-forest" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
