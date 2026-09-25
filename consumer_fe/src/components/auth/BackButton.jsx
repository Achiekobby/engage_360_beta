import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export default function BackButton({ fallback = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={clsx(
        'inline-flex items-center gap-1.5 text-sm font-medium text-[#717171] transition-colors hover:text-[#0B1354] cursor-pointer',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
