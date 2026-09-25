import { User } from 'lucide-react';
import { clsx } from 'clsx';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function CustomerAvatar({ name, imageUrl, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl',
  };

  const initials = getInitials(name);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={clsx('shrink-0 rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EDE8F8] to-[#F7F8FF] font-bold text-primary ring-2 ring-white',
        sizes[size],
        className,
      )}
      aria-hidden={!name}
    >
      {initials || <User className="h-1/2 w-1/2" strokeWidth={2} />}
    </div>
  );
}
