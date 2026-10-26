import { Mail, MessageCircle, Phone } from 'lucide-react';
import ContactForm from '../../components/rewards/contact/ContactForm';
import { RECIPIENT_OFFER } from '../../components/recipient-offer/offerData';

const { contactPhone, contactEmail } = RECIPIENT_OFFER;
const phoneDigits = contactPhone.replace(/\D/g, '');

const CHANNELS = [
  {
    icon: Phone,
    label: 'Call us',
    value: contactPhone.replace(/^\+233(\d{2})(\d{3})(\d{4})$/, '+233 $1 $2 $3'),
    href: `tel:${contactPhone}`,
    tone: 'bg-[#EEE9FF] text-primary',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: `https://wa.me/${phoneDigits}`,
    tone: 'bg-[#E6F6EE] text-[#17A36B]',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    tone: 'bg-[#E3F2FF] text-[#1F7BD8]',
  },
];

export default function RewardsContactPage() {
  return (
    <div className="space-y-8">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Contact us</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#0B1354] sm:text-[40px]">
          We’re here to help
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5B6180]">
          Questions about your points or a redemption? Reach us any way that suits you.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <ul className="grid content-start gap-4">
          {CHANNELS.map(({ icon: Icon, label, value, href, tone, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-4 rounded-2xl border border-[#E6E8F0] bg-white p-5 shadow-[0_6px_20px_rgba(11,19,84,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#3A10CD]/30 hover:shadow-[0_14px_30px_rgba(58,16,205,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#6B7191]">{label}</span>
                  <span className="block truncate text-base font-bold text-[#0B1354] group-hover:text-primary">
                    {value}
                  </span>
                </span>
              </a>
            </li>
          ))}
          <li className="rounded-2xl bg-[#F7F5FF] p-5 text-sm leading-relaxed text-[#4A5070] ring-1 ring-[#E4DEFB]">
            <strong className="font-bold text-[#0B1354]">Support hours:</strong> Monday to Friday, 8am to 6pm GMT.
            Messages sent outside these hours are answered the next business day.
          </li>
        </ul>

        <ContactForm />
      </div>
    </div>
  );
}
