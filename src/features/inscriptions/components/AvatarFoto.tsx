import Image from 'next/image';
import React from 'react';
import { Persona } from '@/features/inscriptions/types';

const DEFAULT_AVATAR = '/avatars/avatar-generico.png';

export default function AvatarFoto({ src, alt, size = 36 }: { src?: string | null; alt: string; size?: number }) {
  const [imgSrc, setImgSrc] = React.useState(src && src.trim() ? src : DEFAULT_AVATAR);
  return (
    <div className="shrink-0 rounded-full overflow-hidden bg-gray-100" style={{ width: size, height: size }}>
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={() => setImgSrc(DEFAULT_AVATAR)}
      />
    </div>
  );
}
