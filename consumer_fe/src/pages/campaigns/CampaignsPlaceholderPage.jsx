import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CAMPAIGNS_BASE } from '../../components/campaigns-module/campaignsNavData';

export default function CampaignsPlaceholderPage({ title, description }) {
  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={CAMPAIGNS_BASE}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to templates
      </Link>

      <div className="mt-8 rounded-sm border border-[#EEF0F4] bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
        <h1 className="text-2xl font-bold text-[#0B1354]">{title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#717171]">
          {description}
        </p>
      </div>
    </main>
  );
}
