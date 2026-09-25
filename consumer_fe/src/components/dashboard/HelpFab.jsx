import { HelpCircle } from 'lucide-react';
import { MotionButton } from '../motion';

export default function HelpFab() {
  return (
    <MotionButton
      onClick={() => {}}
      className="fixed bottom-6 right-6 z-40 flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(58,16,205,0.35)] transition-colors hover:bg-primary/90 sm:bottom-8 sm:right-8 sm:px-6 sm:py-3.5"
      aria-label="Need help?"
    >
      <HelpCircle className="h-5 w-5" strokeWidth={2} />
      Need help?
    </MotionButton>
  );
}
