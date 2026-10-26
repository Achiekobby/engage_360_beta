import { useEffect, useState } from 'react';

const SECOND = 1000;

function breakdown(remaining) {
  const totalSeconds = Math.floor(remaining / SECOND);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Ticks once a second until `endsAt` (ms timestamp). `ended` flips to true at zero. */
export default function useCountdown(endsAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), SECOND);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(endsAt - now, 0);
  return { ...breakdown(remaining), ended: remaining === 0 };
}
