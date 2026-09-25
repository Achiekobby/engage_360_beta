import { clsx } from 'clsx';
import { logo, logoWhite } from '../../utils/images';

/**
 * Engage360 wordmark.
 * `on-white` is the blue logo for light surfaces.
 * `on-primary` is the white logo for blue or dark surfaces.
 */
export default function LogoMark({ className, variant = 'on-primary', size = 48 }) {
  const onLight = variant === 'on-white';

  return (
    <img
      src={onLight ? logo : logoWhite}
      alt=""
      height={size}
      className={clsx('w-auto shrink-0 object-contain', className)}
      style={{ height: size }}
    />
  );
}
