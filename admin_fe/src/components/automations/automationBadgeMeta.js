import {
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const CHANNEL_META = {
  SMS: {
    icon: MessageSquare,
    className: 'bg-[#EFF6FF] text-primary',
  },
  Email: {
    icon: Mail,
    className: 'bg-[#E8F4FC] text-[#2E7DAD]',
  },
  WhatsApp: {
    icon: MessageCircle,
    className: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
};

export const APPROVAL_META = {
  'Auto-approval': {
    icon: ShieldCheck,
    className: 'bg-[#3F3F46] text-white',
  },
  'Business-approval': {
    icon: Building2,
    className: 'bg-[#52525B] text-white',
  },
};

export const STATUS_META = {
  pending: {
    icon: Clock3,
    className: 'bg-[#FFF1E8] text-[#E67E22]',
  },
  'pending-review': {
    icon: Eye,
    className: 'bg-[#FFF8E1] text-[#C9A227]',
  },
  sent: {
    icon: CheckCircle2,
    className: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
};
