import {
  BarChart3,
  Calendar,
  Diamond,
  LayoutGrid,
  Link2,
  Mail,
  MessageCircle,
  MessageSquare,
  Users,
} from 'lucide-react';

const ICONS = {
  users: Users,
  layout: LayoutGrid,
  calendar: Calendar,
  link: Link2,
  diamond: Diamond,
  chart: BarChart3,
};

const CHANNEL_ICONS = [
  { icon: MessageSquare, label: 'SMS' },
  { icon: Mail, label: 'Email' },
  { icon: MessageCircle, label: 'WhatsApp' },
];

function MultiChannelIcons() {
  return (
    <div className="flex items-center gap-2">
      {CHANNEL_ICONS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-[#E8F0FE] text-[#3A10CD]"
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}

function CardIcon({ icon, iconBg, iconColor, isMultiChannel }) {
  if (isMultiChannel) return <MultiChannelIcons />;

  const Icon = ICONS[icon];

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </div>
  );
}

export default function CampaignScaleCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  accent,
  channels,
  variant,
}) {
  const isPrimary = variant === 'primary';
  const isMultiChannel = icon === 'multiChannel';

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border shadow-[0_4px_24px_rgba(11,19,84,0.04)] ${
        isPrimary
          ? 'border-[#3A10CD]/20 bg-[#3A10CD]'
          : 'border-[#EEF0F4] bg-white'
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <CardIcon
          icon={icon}
          iconBg={iconBg}
          iconColor={iconColor}
          isMultiChannel={isMultiChannel}
        />

        <h3
          className={`mt-5 text-lg font-bold sm:text-xl ${
            isPrimary ? 'text-white' : 'text-[#0B1354]'
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2.5 flex-1 text-sm leading-relaxed sm:text-[15px] sm:leading-7 ${
            isPrimary ? 'text-white/85' : 'text-[#717171]'
          }`}
        >
          {description}
        </p>

        {channels?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {channels.map((channel) => (
              <span
                key={channel}
                className="rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-semibold text-[#3A10CD]"
              >
                {channel}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
