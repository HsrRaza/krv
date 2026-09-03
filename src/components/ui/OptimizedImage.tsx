"use client";

import { useState } from "react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  aspectRatio?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  className = "",
  aspectRatio,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const optimizedUrl = getOptimizedImageUrl(src, width);

  return (
    <div
      className={`relative overflow-hidden bg-slate-200/80 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton Shimmer Overlay */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse z-10" />
      )}

      <img
        src={optimizedUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
