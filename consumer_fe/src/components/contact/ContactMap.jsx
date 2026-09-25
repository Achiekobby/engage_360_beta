import { ExternalLink, MapPin } from 'lucide-react';
import { Reveal } from '../motion';
import { CONTACT_LOCATION } from './contactData';

export default function ContactMap() {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.1}>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white">
        <div className="border-b border-[#E4E4E7] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B1354] sm:text-lg">Our Location</h2>
                <p className="mt-0.5 text-sm text-[#717171]">{CONTACT_LOCATION.address}</p>
                <p className="text-sm text-[#717171]">{CONTACT_LOCATION.city}</p>
              </div>
            </div>
            <a
              href={CONTACT_LOCATION.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              Open in Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] flex-1 lg:min-h-[420px]">
          <iframe
            title="Engage360 office location"
            src={CONTACT_LOCATION.embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </Reveal>
  );
}
