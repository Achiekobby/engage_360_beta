import { useEffect, useRef } from 'react';

/**
 * Controlled N-digit one-time-code input.
 * Handles typing, paste, SMS autofill (iOS/Android drop the whole code in one box),
 * backspace/arrow navigation, and calls `onComplete` once when the last digit lands.
 * Bump `focusKey` to move focus back to the first box (e.g. after a wrong code).
 */
export default function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  focusKey = 0,
  label = 'Verification code',
}) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || '');

  useEffect(() => {
    refs.current[0]?.focus();
  }, [focusKey]);

  const commit = (next) => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    onChange(clean);
    if (clean.length === length && clean !== value) onComplete?.(clean);
    return clean;
  };

  const handleChange = (index, raw) => {
    let incoming = raw.replace(/\D/g, '');
    // Typing into a box that already holds a digit yields two characters; keep the new one.
    if (digits[index] && incoming.length === 2) {
      incoming = incoming.replace(digits[index], '').slice(0, 1) || incoming[1];
    }
    if (!incoming) {
      const next = digits.slice();
      next[index] = '';
      onChange(next.join('').slice(0, length));
      return;
    }

    const head = value.slice(0, index).padEnd(index, ' ');
    const merged = (head + incoming + value.slice(index + incoming.length)).replace(/ /g, '');
    const clean = commit(merged);
    refs.current[Math.min(index + incoming.length, length - 1, clean.length)]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      onChange(value.slice(0, index - 1));
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();
    const clean = commit(pasted);
    refs.current[Math.min(clean.length, length - 1)]?.focus();
  };

  return (
    <div role="group" aria-label={label} className="flex justify-between gap-2 sm:gap-2.5">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={error || undefined}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={`h-[52px] w-full min-w-0 rounded-xl border bg-white text-center text-xl font-bold text-[#0B1354] outline-none transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_4px_rgba(58,16,205,0.14)] disabled:bg-[#F4F5F9] sm:h-14 ${
            error ? 'border-[#E5484D]' : digit ? 'border-[#3A10CD]/50 bg-[#FAF9FF]' : 'border-[#DDE0EA]'
          }`}
        />
      ))}
    </div>
  );
}
