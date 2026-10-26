import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Copy, Check, Loader2, X } from 'lucide-react';
import { detectNetwork, formatGhanaPhone } from '../../../constants/ghanaNetworks';
import { getNetworkLabel } from '../../../constants/rewardsCatalog';
import useRecipient from '../../../hooks/useRecipient';
import {
  getErrorMessage,
  getRewardAvailability,
  isSessionExpired,
  redeemReward,
} from '../../../services/recipient';
import { createId } from '../../../services/recipient/ids';
import { resolveRedemptionStatus } from '../../../services/recipient/wallet';
import ModalShell from '../../ui/ModalShell';
import { FormAlert } from '../../ui/formControls';

const TITLE_ID = 'redeem-dialog-title';

function Row({ label, children, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-[#6B7191]">{label}</dt>
      <dd className={`text-right text-sm ${strong ? 'text-base font-extrabold text-primary' : 'font-semibold text-[#0B1354]'}`}>
        {children}
      </dd>
    </div>
  );
}

function ConfirmView({
  reward,
  phone,
  wallet,
  availability,
  prefixNetwork,
  confirmed,
  onConfirmedChange,
  busy,
  error,
  onConfirm,
  onClose,
}) {
  const balanceAfter = wallet.balance - reward.points;
  const prefixLabel = prefixNetwork ? getNetworkLabel(prefixNetwork) : '';
  const prefixDiffers = Boolean(prefixLabel) && prefixNetwork !== reward.network;

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-5">
        <div className="flex items-center gap-3.5">
          <img
            src={reward.image}
            alt=""
            className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-[0_8px_18px_rgba(11,19,84,0.18)]"
          />
          <div>
            <h2 id={TITLE_ID} className="text-lg font-bold text-[#0B1354]">
              Redeem {reward.headline}
            </h2>
            <p className="text-sm text-[#6B7191]">{reward.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          className="-mr-1 inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6B7191] transition-colors hover:bg-[#F0F2F7] hover:text-[#0B1354] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <dl className="divide-y divide-[#EEF0F4] rounded-2xl border border-[#E6E8F0] bg-[#FAFAFD] px-4">
          <Row label="Reward">{reward.headline}</Row>
          <Row label="Delivered to">
            <span className="tabular-nums">{formatGhanaPhone(phone)}</span>
          </Row>
          <Row label="Your balance">{wallet.balance.toLocaleString()} pts</Row>
          <Row label="Cost" strong>
            − {reward.points.toLocaleString()} pts
          </Row>
          <Row label="Balance after">{Math.max(balanceAfter, 0).toLocaleString()} pts</Row>
        </dl>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4DEFB] bg-[#F7F5FF] px-3.5 py-3">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={busy}
            onChange={(event) => onConfirmedChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />
          <span className="text-[13px] leading-snug text-[#3A3F66]">
            <span className="font-semibold text-[#0B1354]">
              This number is currently on {reward.networkLabel}.
            </span>{' '}
            {prefixDiffers
              ? `The prefix looks like ${prefixLabel}, but porting keeps the old prefix. Only continue if the line is on ${reward.networkLabel} today.`
              : 'Porting keeps the original prefix, so confirm the network this number is on today.'}
          </span>
        </label>

        <p className="mt-3 text-xs leading-relaxed text-[#6B7191]">
          Airtime is sent only to your verified number and can’t be redeemed to another number. Redemptions are
          final and can’t be reversed.
        </p>

        <div className="mt-4 space-y-3">
          {availability.state !== 'available' && !busy ? (
            <FormAlert>{availability.message}</FormAlert>
          ) : null}
          <FormAlert>{error}</FormAlert>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-[#DDE0EA] bg-white text-[15px] font-semibold text-[#3A3F66] transition-colors hover:bg-[#F4F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || !confirmed || availability.state !== 'available'}
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                Redeeming…
              </>
            ) : (
              'Confirm & redeem'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function SuccessView({ reward, redemption, balance, status, onViewActivity, onClose }) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const completed = status === 'Completed';

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(redemption.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7 text-center">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EFFBF4] text-[#17A36B] ring-8 ring-[#EFFBF4]/60"
      >
        <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
      </motion.div>

      <h2 id={TITLE_ID} className="text-xl font-bold text-[#0B1354] sm:text-2xl">
        {completed ? 'Airtime delivered!' : 'Airtime on its way'}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5B6180]">
        {reward.headline} {completed ? 'has been added to' : 'is being sent to'}{' '}
        <strong className="font-semibold tabular-nums text-[#0B1354]">{formatGhanaPhone(redemption.phone)}</strong>.
      </p>

      <dl className="mt-5 divide-y divide-[#EEF0F4] rounded-2xl border border-[#E6E8F0] bg-[#FAFAFD] px-4 text-left">
        <Row label="Status">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
              completed ? 'bg-[#EFFBF4] text-[#17734A]' : 'bg-[#FFF7E6] text-[#A15C07]'
            }`}
          >
            {completed ? null : <Loader2 className="h-3 w-3 animate-spin" strokeWidth={3} />}
            {status}
          </span>
        </Row>
        <Row label="Reference">
          <button
            type="button"
            onClick={copyReference}
            className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[13px] font-bold tracking-wide text-[#0B1354] hover:text-primary"
            aria-label={`Copy reference ${redemption.reference}`}
          >
            {redemption.reference}
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[#17A36B]" strokeWidth={2.75} />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#8A90A6]" strokeWidth={2.25} />
            )}
          </button>
        </Row>
        <Row label="Points used">{redemption.points.toLocaleString()} pts</Row>
        <Row label="New balance" strong>
          {balance.toLocaleString()} pts
        </Row>
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onViewActivity}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-[#DDE0EA] bg-white text-[15px] font-semibold text-[#3A3F66] transition-colors hover:bg-[#F4F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          View activity
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function FailureView({ message, sessionExpired, onClose }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3F3] text-[#E5484D] ring-8 ring-[#FFF3F3]/60">
        <AlertTriangle className="h-7 w-7" strokeWidth={2} />
      </div>
      <h2 id={TITLE_ID} className="text-xl font-bold text-[#0B1354] sm:text-2xl">
        {sessionExpired ? 'Session expired' : 'Couldn’t redeem'}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5B6180]">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-7 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {sessionExpired ? 'Verify again' : 'Close'}
      </button>
    </div>
  );
}

/**
 * Confirm → processing → result. Mount with a fresh `key` per open so state resets.
 * One `requestId` is generated per dialog, so a retry or double-click can never
 * redeem twice (the service treats it as the same request).
 */
export default function RedeemDialog({ reward, open, onClose }) {
  const navigate = useNavigate();
  const { phone, wallet, recipient, now } = useRecipient();
  const [requestId] = useState(() => createId('req'));
  const [phase, setPhase] = useState('confirm');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [failure, setFailure] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const availability = getRewardAvailability(reward, { wallet });
  const prefixNetwork = detectNetwork(phone);

  const handleConfirm = async () => {
    if (busy || !confirmed) return;
    setBusy(true);
    setError('');
    try {
      const response = await redeemReward({
        phone,
        rewardId: reward.id,
        requestId,
        confirmedNetwork: reward.network,
      });
      setResult(response);
      setPhase('success');
    } catch (err) {
      if (isSessionExpired(err)) {
        setFailure({ message: err.message, sessionExpired: true });
        setPhase('failure');
      } else if (['NETWORK_UNCONFIRMED', 'DAILY_LIMIT', 'INSUFFICIENT_POINTS', 'REWARD_UNAVAILABLE'].includes(err.code)) {
        setFailure({ message: getErrorMessage(err), sessionExpired: false });
        setPhase('failure');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const liveRedemption = result
    ? recipient?.redemptions.find((item) => item.id === result.redemption.id) || result.redemption
    : null;

  return (
    <ModalShell open={open} onClose={onClose} labelledBy={TITLE_ID} dismissible={!busy} size="sm">
      {phase === 'confirm' ? (
        <ConfirmView
          reward={reward}
          phone={phone}
          wallet={wallet}
          availability={availability}
          prefixNetwork={prefixNetwork}
          confirmed={confirmed}
          onConfirmedChange={setConfirmed}
          busy={busy}
          error={error}
          onConfirm={handleConfirm}
          onClose={onClose}
        />
      ) : null}
      {phase === 'success' ? (
        <SuccessView
          reward={reward}
          redemption={liveRedemption}
          balance={wallet.balance}
          status={resolveRedemptionStatus(liveRedemption, now)}
          onViewActivity={() => {
            onClose();
            navigate('/rewards/activity');
          }}
          onClose={onClose}
        />
      ) : null}
      {phase === 'failure' ? (
        <FailureView message={failure.message} sessionExpired={failure.sessionExpired} onClose={onClose} />
      ) : null}
    </ModalShell>
  );
}
