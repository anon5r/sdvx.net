import { useState } from 'react';
import { jacketUrl } from './jackets';

interface Props {
  ym: string;
  game: string;
  index: number;
  size: number;
}

export function JacketImage({ ym, game, index, size }: Props) {
  const [missing, setMissing] = useState(false);
  const src = jacketUrl(ym, game, index);

  if (missing) return null;

  return (
    <img
      src={src}
      width={size}
      height={size}
      className="img-shadow"
      alt=""
      onError={() => {
        console.error(`Image Not Found: ${src}`);
        setMissing(true);
      }}
    />
  );
}
