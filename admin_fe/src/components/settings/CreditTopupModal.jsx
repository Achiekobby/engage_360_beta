import { useEffect, useId, useState } from 'react';
import { Check } from 'lucide-react';
import AnimatedModal from '../motion/AnimatedModal';
import { useAppDispatch } from '../../store/hooks';
import { updateBusiness } from '../../store/slices/businessesSlice';
import { creditBalanceFor } from './settingsData';

export default function CreditTopupModal({ business, onClose }) {
  const dispatch = useAppDispatch();
  const titleId = useId();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('form');
  const balance = business ? creditBalanceFor(business) : 0;
  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0;

  useEffect(() => {
    setAmount('');
    setError('');
    setPhase('form');
  }, [business?.id]);

  const submit = (event) => {
    event.preventDefault();
    if (!business || !valid) {
      setError('Enter a credit amount greater than zero.');
      return;
    }
    setPhase('working');
    window.setTimeout(() => {
      dispatch(
        updateBusiness({
          id: business.id,
          changes: { creditBalance: balance + parsed },
        }),
      );
      setPhase('done');
    }, 700);
  };

  return (
    <AnimatedModal
      isOpen={Boolean(business)}
      onClose={phase === 'working' ? () => {} : onClose}
      closeOnBackdrop={phase !== 'working'}
      labelledBy={titleId}
      panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      {phase === 'form' ? (
        <>
          <h2 id={titleId} className="text-lg font-bold text-[#0B1354]">
            Credit top-up
          </h2>
          <p className="mt-1 text-sm text-[#717171]">
            {business?.companyName} currently has {balance.toLocaleString('en-GB')} credits.
          </p>
          <form className="mt-5" onSubmit={submit}>
            <label htmlFor="settings-credit-amount" className="mb-1.5 block text-sm font-medium text-[#0B1354]">
              Credits to add
            </label>
            <input
              id="settings-credit-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError('');
              }}
              placeholder="0"
              className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {error ? <p className="mt-1 text-xs text-[#DC2626]">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
                Add credits
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-[6px] border-[#EEF0F4]" />
            <span
              className={phase === 'working' ? 'absolute inset-0 animate-spin rounded-full border-[6px] border-primary border-t-transparent' : 'absolute inset-0 rounded-full border-[6px] border-primary'}
            />
            {phase === 'done' ? <Check className="relative h-7 w-7 text-primary" strokeWidth={2.25} /> : null}
          </span>
          <h2 id={titleId} className="mt-5 text-lg font-bold text-[#0B1354]">
            {phase === 'working' ? 'Adding credits' : 'Credits added'}
          </h2>
          <p className="mt-1 text-sm text-[#717171]">
            {phase === 'working'
              ? `Sending ${parsed.toLocaleString('en-GB')} credits to ${business?.companyName}.`
              : `${parsed.toLocaleString('en-GB')} credits are now on ${business?.companyName}.`}
          </p>
          {phase === 'done' ? (
            <button type="button" onClick={onClose} className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
              Done
            </button>
          ) : null}
        </div>
      )}
    </AnimatedModal>
  );
}
