import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageBackLink({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
