/**
 * Ghana mobile number helpers. Numbers are stored in E.164 (+233XXXXXXXXX).
 *
 * `detectNetwork` reads the prefix the number was originally issued with.
 * It is not the current operator: Ghana number portability lets a line move
 * between MTN, Telecel and AT without changing the number.
 */
const PREFIX_TO_NETWORK = {
  24: 'mtn',
  25: 'mtn',
  53: 'mtn',
  54: 'mtn',
  55: 'mtn',
  59: 'mtn',
  20: 'telecel',
  50: 'telecel',
  26: 'at',
  27: 'at',
  56: 'at',
  57: 'at',
  23: 'glo',
};

const localPart = (e164) => String(e164 || '').replace(/^\+233/, '');

/** Accepts 024 123 4567, 24 123 4567, +233 24 123 4567, 233241234567. Returns E.164 or null. */
export function normalizeGhanaPhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  let local = null;

  if (digits.startsWith('233') && digits.length === 12) local = digits.slice(3);
  else if (digits.startsWith('0') && digits.length === 10) local = digits.slice(1);
  else if (digits.length === 9) local = digits;

  if (!local || !PREFIX_TO_NETWORK[local.slice(0, 2)]) return null;
  return `+233${local}`;
}

/** Original prefix only: 'mtn' | 'telecel' | 'at' | 'glo' | null. Not the network after porting. */
export function detectNetwork(e164) {
  const local = localPart(e164);
  if (local.length !== 9) return null;
  return PREFIX_TO_NETWORK[local.slice(0, 2)] || null;
}

export function formatGhanaPhone(e164) {
  const local = localPart(e164);
  if (local.length !== 9) return e164 || '';
  return `+233 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export function maskGhanaPhone(e164) {
  const local = localPart(e164);
  if (local.length !== 9) return e164 || '';
  return `+233 ${local.slice(0, 2)} ••• ${local.slice(5)}`;
}
