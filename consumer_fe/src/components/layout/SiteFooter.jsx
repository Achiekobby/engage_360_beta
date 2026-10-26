import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import LogoMark from '../brand/LogoMark';
import { Reveal, StaggerReveal, StaggerItem } from '../motion';

const FOOTER_LINKS = {
  support: [
    { label: 'Help Center', to: '/resources' },
    { label: 'Privacy & Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
  ],
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Product', to: '/product' },
    { label: 'Rewards', to: '/offer' },
    { label: 'Resources', to: '/resources' },
  ],
  contact: [
    { label: 'Get in touch', to: '/contact' },
    { label: 'Contact sales', to: '/contact' },
    { label: 'Become an Agent', to: '#' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'TikTok', href: '#', icon: TikTokIcon },
  { label: 'YouTube', href: '#', icon: Youtube },
];

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function FooterLinkColumn({ title, links, titleClassName = 'text-[#0B1354]' }) {
  return (
    <div>
      <h3 className={`text-[15px] font-bold sm:text-base ${titleClassName}`}>{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            {to.startsWith('#') ? (
              <a
                href={to}
                className="text-[14px] text-[#717171] transition-colors hover:text-primary sm:text-[15px]"
              >
                {label}
              </a>
            ) : (
              <Link
                to={to}
                className="text-[14px] text-[#717171] transition-colors hover:text-primary sm:text-[15px]"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter({ homePath = '/' }) {
  return (
    <footer className="relative overflow-hidden border-t border-[#EEF0F4] bg-white">
      <div className="relative mx-auto w-full max-w-8xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <StaggerReveal className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-5 lg:gap-6 xl:gap-8" stagger={0.07}>
          <StaggerItem className="col-span-2 lg:col-span-1">
            <Link to={homePath} className="inline-flex items-center">
              <LogoMark size={52} variant="on-white" />
            </Link>
            <p className="mt-4 max-w-[13.5rem] text-[14px] leading-[1.55] text-[#717171] sm:text-[15px]">
              Everything You Need to Engage and Grow
            </p>
          </StaggerItem>

          <StaggerItem>
            <FooterLinkColumn title="Support" links={FOOTER_LINKS.support} />
          </StaggerItem>
          <StaggerItem>
            <FooterLinkColumn title="Company" links={FOOTER_LINKS.company} />
          </StaggerItem>
          <StaggerItem>
            <FooterLinkColumn title="Contact" links={FOOTER_LINKS.contact} />
          </StaggerItem>

          <StaggerItem className="col-span-2 lg:col-span-1">
            <h3 className="text-[15px] font-bold text-primary sm:text-base">Social</h3>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center text-[#0B1354] transition-colors hover:text-primary sm:h-9 sm:w-9"
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
                </a>
              ))}
            </div>
          </StaggerItem>
        </StaggerReveal>

        <Reveal delay={0.15}>
          <p className="relative mt-16 text-[13px] text-[#717171] sm:mt-20 sm:text-sm">
            @ {new Date().getFullYear()} Engage 360. All Right Reserved
          </p>
        </Reveal>

        <div
          className="pointer-events-none absolute -bottom-32 left-1/2 h-[min(42vw,200px)] w-[min(88vw,400px)] -translate-x-1/2 rounded-t-full border-[min(12vw,52px)] border-b-0 border-[#E6E6FA]"
          aria-hidden="true"
        />
      </div>
    </footer>
  );
}
