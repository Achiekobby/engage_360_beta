import { Link } from 'react-router-dom';
import { Clock, Headset, ShieldCheck } from 'lucide-react';
import { StaggerReveal, StaggerItem } from '../motion';
import { CONTACT_FORM_HIGHLIGHTS, CONTACT_NEXT_STEPS } from './contactData';

const HIGHLIGHT_ICONS = [Clock, Headset, ShieldCheck];

export default function ContactFormFooter() {
  return (
    <div className="border-t border-[#E4E4E7] pt-6">
      <StaggerReveal className="grid grid-cols-1 gap-4 sm:grid-cols-3" stagger={0.08}>
        {CONTACT_FORM_HIGHLIGHTS.map((item, index) => {
          const Icon = HIGHLIGHT_ICONS[index];

          return (
            <StaggerItem key={item.title}>
              <div className="rounded-xl bg-[#F8F9FB] px-4 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <p className="mt-2.5 text-sm font-semibold text-[#0B1354]">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#717171]">{item.description}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerReveal>

      <StaggerReveal className="mt-5 rounded-xl bg-[#E8ECF8]/60 px-4 py-4 sm:px-5" stagger={0.06}>
        <StaggerItem>
          <p className="text-sm font-semibold text-[#0B1354]">What happens next?</p>
          <ol className="mt-3 space-y-2">
            {CONTACT_NEXT_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3 text-xs leading-relaxed text-[#5B5F7B] sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-[#717171] sm:text-sm">
            Prefer self-service? Visit our{' '}
            <Link to="/resources" className="font-medium text-primary hover:text-primary/80">
              Help Center
            </Link>
            .
          </p>
        </StaggerItem>
      </StaggerReveal>
    </div>
  );
}
