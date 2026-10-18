import { useState } from 'react';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_CHANNELS,
  CAMPAIGN_TEMPLATES,
  labelFor,
} from '../../components/campaigns/campaignData';

export default function CampaignTemplatesPage() {
  const [category, setCategory] = useState('all');
  const [channel, setChannel] = useState('all');
  const rows = CAMPAIGN_TEMPLATES.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (channel !== 'all' && item.channel !== channel) return false;
    return true;
  });

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Campaign templates"
        description="Reference SMS, email, and WhatsApp examples used by businesses."
        backTo="/campaigns"
        backLabel="Campaign management"
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategory('all')} className={chip(category === 'all')}>
          All categories
        </button>
        {CAMPAIGN_CATEGORIES.filter((item) => !item.comingSoon).map((item) => (
          <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={chip(category === item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setChannel('all')} className={chip(channel === 'all')}>
          All channels
        </button>
        {CAMPAIGN_CHANNELS.map((item) => (
          <button key={item.id} type="button" onClick={() => setChannel(item.id)} className={chip(channel === item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
          <article key={item.id} className="flex flex-col admin-card rounded-xl border border-[#EEF0F4] bg-white p-4">
            <p className="text-xs font-medium text-[#717171]">
              {labelFor(CAMPAIGN_CHANNELS, item.channel)} · {labelFor(CAMPAIGN_CATEGORIES, item.category)}
            </p>
            <h2 className="mt-1 text-base font-semibold text-[#0B1354]">{item.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3F3F46]">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function chip(active) {
  return clsx(
    'rounded-full border px-3 py-1.5 text-sm font-medium',
    active ? 'border-primary/40 bg-[#EFF6FF] text-primary' : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:border-[#D4D4D8]',
  );
}
