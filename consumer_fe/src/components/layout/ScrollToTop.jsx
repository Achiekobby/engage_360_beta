import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollPageToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.querySelectorAll('[data-app-scroll]').forEach((node) => {
    node.scrollTop = 0;
  });
}

export default function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) return undefined;

    scrollPageToTop();
    const frame = requestAnimationFrame(scrollPageToTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname, search, hash, key]);

  return null;
}
