import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import Images from '../../utils/Images';
import { RECIPIENT_OFFER } from './offerData';

const SOCIALS = [
  { label: 'Facebook', icon: Facebook },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Instagram', icon: Instagram },
  { label: 'TikTok', icon: TikTokIcon },
  { label: 'YouTube', icon: Youtube },
];

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function RecipientOfferFooter() {
  return (
    <footer className="bg-[#0B0B0F] text-white">
      <div className="mx-auto grid w-full max-w-8xl gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr] lg:items-start lg:px-8 lg:py-12">
        <img
          src={Images.logoWhite}
          alt="Engage360"
          className="h-12 w-auto object-contain object-left"
        />

        <div>
          <p className="text-base font-semibold">Contact Number</p>
          <a
            href={`tel:${RECIPIENT_OFFER.contactPhone.replace(/\s/g, '')}`}
            className="mt-3 inline-block text-sm text-white/80 transition-colors hover:text-white"
          >
            {RECIPIENT_OFFER.contactPhone}
          </a>
        </div>

        <div>
          <p className="text-base font-semibold">Email</p>
          <a
            href={`mailto:${RECIPIENT_OFFER.contactEmail}`}
            className="mt-3 inline-block text-sm text-white/80 transition-colors hover:text-white"
          >
            {RECIPIENT_OFFER.contactEmail}
          </a>
        </div>

        <div>
          <p className="text-base font-semibold">Social</p>
          <div className="mt-3 flex items-center gap-3">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#offer-top"
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
