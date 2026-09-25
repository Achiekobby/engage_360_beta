import { useEffect, useId, useState } from 'react';
import AnimatedModal from '../motion/AnimatedModal';
import { useAppDispatch } from '../../store/hooks';
import { updateBusiness } from '../../store/slices/businessesSlice';

export default function BusinessCreditModal({ business, onClose }) {
  const dispatch = useAppDispatch();
  const titleId = useId();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const balance = business?.creditBalance ?? 0;
  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0;

  useEffect(() => {
    if (business) {
      setAmount('');
      setError('');
    }
  }, [business]);

  return (
    <AnimatedModal
      isOpen={Boolean(business)}
      onClose={onClose}
      labelledBy={titleId}
      panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <h2 id={titleId} className="text-lg font-bold text-[#0B1354]">
        Credit top-up
      </h2>
      <p className="mt-1 text-sm text-[#717171]">
        {business?.companyName} currently has {balance.toLocaleString('en-GB')} credits.
      </p>
      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!business || !valid) {
            setError('Enter a credit amount greater than zero.');
            return;
          }
          dispatch(
            updateBusiness({
              id: business.id,
              changes: { creditBalance: balance + parsed },
            }),
          );
          onClose();
        }}
      >
        <label htmlFor="credit-amount" className="mb-1.5 block text-sm font-medium text-[#0B1354]">
          Credits to add
        </label>
        <input
          id="credit-amount"
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
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Add credits
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}
