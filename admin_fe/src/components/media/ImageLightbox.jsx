import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, RotateCcw, X, ZoomIn } from 'lucide-react';
import { clsx } from 'clsx';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.25;

export function fullImageUrl(src) {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.origin);
    if (url.searchParams.has('w')) url.searchParams.set('w', '1600');
    if (url.searchParams.has('h')) url.searchParams.delete('h');
    if (url.searchParams.has('q')) url.searchParams.set('q', '90');
    return url.toString();
  } catch {
    return src;
  }
}

export default function ImageLightbox({ src, alt = 'Banner', onClose }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const stageRef = useRef(null);

  const setZoomTo = (next) => {
    const value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(next.toFixed(2))));
    setZoom(value);
    if (value === MIN_ZOOM) setOffset({ x: 0, y: 0 });
  };

  const nudgeZoom = (delta) => {
    setZoom((current) => {
      const value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((current + delta).toFixed(2))));
      if (value === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return value;
    });
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === '+' || event.key === '=') nudgeZoom(STEP);
      if (event.key === '-' || event.key === '_') nudgeZoom(-STEP);
      if (event.key === '0') setZoomTo(MIN_ZOOM);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const stage = stageRef.current;
    const onWheel = (event) => {
      event.preventDefault();
      nudgeZoom(event.deltaY < 0 ? STEP : -STEP);
    };
    stage?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      document.body.style.overflow = previous;
      stage?.removeEventListener('wheel', onWheel);
    };
  }, []);

  const onPointerDown = (event) => {
    if (zoom <= MIN_ZOOM) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    setOffset({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y });
  };

  const endDrag = () => {
    drag.current = null;
  };

  if (!src) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex flex-col bg-[#0B1354]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="min-w-0 truncate text-sm font-medium">{alt}</p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Close image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={stageRef}
        className={clsx(
          'relative flex min-h-0 flex-1 items-center justify-center overflow-hidden',
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setZoomTo(zoom === MIN_ZOOM ? 2 : MIN_ZOOM)}
      >
        <img
          src={fullImageUrl(src)}
          alt={alt}
          draggable={false}
          className="pointer-events-none max-h-full max-w-full object-contain select-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#0B1354]/70 p-1 text-white">
          <button
            type="button"
            onClick={() => setZoomTo(zoom - STEP)}
            disabled={zoom <= MIN_ZOOM}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-12 text-center text-xs font-semibold tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoomTo(zoom + STEP)}
            disabled={zoom >= MAX_ZOOM}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomTo(MIN_ZOOM)}
            disabled={zoom === MIN_ZOOM}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function BannerButton({ src, alt, className }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <span className="text-[#A1A1AA]">—</span>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          'group relative overflow-hidden rounded-lg border border-[#EEF0F4] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          className,
        )}
        aria-label={`Open full ${alt}`}
      >
        <img src={src} alt={alt} onError={() => setFailed(true)} className="h-24 w-40 object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-[#0B1354]/0 text-white transition-colors group-hover:bg-[#0B1354]/35">
          <ZoomIn className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>
      {open ? <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
