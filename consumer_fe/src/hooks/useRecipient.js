import { useMemo, useSyncExternalStore } from 'react';
import { detectNetwork } from '../constants/ghanaNetworks';
import {
  EMPTY_WALLET,
  computeWallet,
  endSession,
  getProfileGaps,
  getRecipientSnapshot,
  subscribeRecipientStore,
} from '../services/recipient';

/**
 * Reactive view of the verified recipient. Re-renders on login/logout, profile
 * changes, redemptions, and at the moments time-based state flips (a pending
 * award clearing, a redemption completing, the session expiring).
 */
export default function useRecipient() {
  const { session, recipient, now } = useSyncExternalStore(
    subscribeRecipientStore,
    getRecipientSnapshot,
    getRecipientSnapshot,
  );

  const isVerified = Boolean(session && recipient?.verified);
  const phone = isVerified ? session.phone : '';

  const wallet = useMemo(
    () => (isVerified ? computeWallet(recipient, now) : EMPTY_WALLET),
    [isVerified, recipient, now],
  );
  const gaps = useMemo(() => getProfileGaps(recipient), [recipient]);

  return {
    isVerified,
    phone,
    prefixNetwork: detectNetwork(phone),
    recipient: isVerified ? recipient : null,
    wallet,
    gaps,
    now,
    signOut: endSession,
  };
}
