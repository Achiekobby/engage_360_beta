import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

const CONTROL =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E7] bg-white py-1 pl-1 pr-3.5 text-sm font-semibold text-[#0B1354] shadow-[0_1px_2px_rgba(11,19,84,0.06)] transition-colors hover:border-primary/35 hover:bg-[#F8FAFF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';

function BackMark() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
    </span>
  );
}

export function PageBackLink({ to, onClick, label = 'Back', className }) {
  const aria = label === 'Back' ? 'Back' : `Back to ${label}`;
  const body = (
    <>
      <BackMark />
      Back
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={aria} className={clsx(CONTROL, className)}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={aria} className={clsx(CONTROL, className)}>
      {body}
    </button>
  );
}

export function PageHeading({
  title,
  description,
  backTo,
  backLabel,
  onBack,
  actions,
  children,
  framed = true,
  as: Title = 'h1',
}) {
  const inner = (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Title className="text-xl font-bold tracking-tight text-[#0B1354]">{title}</Title>
          {description ? <p className="mt-1 text-sm leading-relaxed text-[#717171]">{description}</p> : null}
        </div>
        {backTo || onBack || actions ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {actions}
            {backTo || onBack ? <PageBackLink to={backTo} onClick={onBack} label={backLabel} /> : null}
          </div>
        ) : null}
      </div>
      {children ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-[#F0F2F7] pt-4 sm:flex-row sm:items-center">
          {children}
        </div>
      ) : null}
    </>
  );

  if (!framed) return <div>{inner}</div>;

  return (
    <header className="rounded-xl border border-[#EEF0F4] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(11,19,84,0.04)] sm:px-5">
      {inner}
    </header>
  );
}
