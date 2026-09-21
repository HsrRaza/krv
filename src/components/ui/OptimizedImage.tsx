"use client";

import Image, { ImageProps } from "next/image";
import { getMediaUrl } from "@/lib/media";

interface OptimizedImageProps
  extends Omit<ImageProps, "src"> {
  src: string;
  width?: number;
}

export default function OptimizedImage({
  src,
  width = 800,
  alt = "",
  ...props
}: OptimizedImageProps) {
  const mediaUrl = getMediaUrl(src);

  return (
    <Image
      {...props}
      src={mediaUrl}
      alt={alt}
      width={width}
      height={props.height ?? Math.round(width * 0.75)}
    />
  );
}