import { Reveal } from '../motion';
import Images from '../../utils/Images';
import { CONTACT_INFO } from './contactData';

function ContactInfoCard({ image, imageAlt, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E4E4E7] bg-white px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-[72px] sm:w-[72px]">
        <img src={image} alt={imageAlt} className="h-full w-full object-contain" />
      </div>
      <div>
        <p className="text-base font-bold text-[#0B1354] sm:text-lg">{title}</p>
        <p className="mt-0.5 text-sm text-[#717171]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ContactInfoCards() {
  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.08}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <ContactInfoCard
          image={Images.contact_us.telephone}
          imageAlt="Phone support"
          title={CONTACT_INFO.phone}
          subtitle={CONTACT_INFO.phoneHours}
        />
        <ContactInfoCard
          image={Images.contact_us.email}
          imageAlt="Email support"
          title={CONTACT_INFO.email}
          subtitle={CONTACT_INFO.emailReply}
        />
      </div>
    </Reveal>
  );
}
