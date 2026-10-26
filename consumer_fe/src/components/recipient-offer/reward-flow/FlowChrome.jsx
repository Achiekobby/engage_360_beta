import { Loader2, Sparkles, X } from 'lucide-react';

export const FLOW_TITLE_ID = 'reward-flow-title';

/** Purple header shared by every step of the verification flow. */
export function FlowHeader({ title, subtitle, pill, onClose }) {
  return (
    <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-primary via-[#4B1FE2] to-[#6B3DF0] px-6 pb-7 pt-6 text-white sm:px-8">
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/[0.07]" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {pill ? (
        <p className="relative mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#FFD66B]" strokeWidth={2.25} />
          {pill}
        </p>
      ) : null}

      <h2 id={FLOW_TITLE_ID} className="relative max-w-[88%] text-[22px] font-bold leading-tight sm:text-2xl">
        {title}
      </h2>
      {subtitle ? <p className="relative mt-1.5 max-w-[92%] text-sm leading-relaxed text-white/80">{subtitle}</p> : null}
    </div>
  );
}

export function FlowBodyPanel({ children, className = '' }) {
  return <div className={`min-h-0 flex-1 overflow-y-auto px-6 pb-7 pt-6 sm:px-8 ${className}`}>{children}</div>;
}

export function LegalNote() {
  return (
    <p className="mt-5 text-center text-xs leading-relaxed text-[#8A90A6]">
      By continuing you agree to our{' '}
      <a href="#terms" className="font-semibold text-[#3A3F66] underline-offset-2 hover:underline">
        Terms
      </a>{' '}
      and{' '}
      <a href="#privacy" className="font-semibold text-[#3A3F66] underline-offset-2 hover:underline">
        Privacy Policy
      </a>
      .
    </p>
  );
}

export function PrimaryButton({ children, busy = false, busyLabel, className = '', ...props }) {
  return (
    <button
      type="submit"
      disabled={busy || props.disabled}
      {...props}
      className={`inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-[background-color,transform,box-shadow] hover:bg-[#320EB8] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none ${className}`}
    >
      {busy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
          {busyLabel || 'Please wait…'}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold text-[#5B6180] transition-colors hover:bg-[#F4F5F9] hover:text-[#0B1354] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function StepLoading({ onClose }) {
  return (
    <>
      <FlowHeader title="Checking your account…" onClose={onClose} />
      <FlowBodyPanel className="flex items-center justify-center py-14">
        <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2.25} aria-label="Loading" />
      </FlowBodyPanel>
    </>
  );
}
