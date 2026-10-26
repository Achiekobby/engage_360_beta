import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, ChevronDown, LogOut, UserRound } from 'lucide-react';
import { formatGhanaPhone, maskGhanaPhone } from '../../constants/ghanaNetworks';
import { getNetworkLabel } from '../../constants/rewardsCatalog';
import useRecipient from '../../hooks/useRecipient';

/** Navbar chip showing the verified number, with "back to offer" and "use a different number". */
export default function AccountMenu() {
  const navigate = useNavigate();
  const { phone, prefixNetwork, signOut } = useRecipient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleSignOut = () => {
    setOpen(false);
    // RecipientGuard notices the missing session and reopens verification on the offer page.
    signOut();
  };

  const itemClass =
    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#F1EEFF]';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white/15 pl-2 pr-3 text-sm font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary">
          <UserRound className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="hidden tabular-nums sm:inline">{maskGhanaPhone(phone)}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] rounded-2xl border border-[#E4E6EF] bg-white p-2 shadow-[0_20px_50px_rgba(11,19,84,0.22)]"
        >
          <div className="mb-1 rounded-xl bg-[#F7F5FF] px-3 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#17734A]">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
              Verified number
            </p>
            <p className="mt-1 text-[15px] font-bold tabular-nums text-[#0B1354]">{formatGhanaPhone(phone)}</p>
            {prefixNetwork ? (
              <p className="text-xs text-[#6B7191]">Prefix looks like {getNetworkLabel(prefixNetwork)}</p>
            ) : null}
          </div>
          <button type="button" role="menuitem" className={itemClass} onClick={() => navigate('/offer')}>
            <ArrowLeft className="h-4 w-4 text-[#6B7191]" strokeWidth={2.25} />
            Back to offers
          </button>
          <button type="button" role="menuitem" className={`${itemClass} text-[#C62A30] hover:bg-[#FFF3F3]`} onClick={handleSignOut}>
            <LogOut className="h-4 w-4" strokeWidth={2.25} />
            Use a different number
          </button>
        </div>
      ) : null}
    </div>
  );
}
