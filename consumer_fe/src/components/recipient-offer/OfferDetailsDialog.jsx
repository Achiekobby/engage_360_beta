import { X } from 'lucide-react';
import ModalShell from '../ui/ModalShell';

const TITLE_ID = 'offer-details-title';

export default function OfferDetailsDialog({ product, open, onClose }) {
  return (
    <ModalShell open={open} onClose={onClose} labelledBy={TITLE_ID} size="lg">
      {product ? (
        <>
          <div className="flex items-center justify-between border-b border-[#EEF0F4] px-6 py-4">
            <h2 id={TITLE_ID} className="text-base font-bold text-[#0B1354]">
              Offer details
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#6B7191] transition-colors hover:bg-[#F0F2F7] hover:text-[#0B1354] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <img
              src={product.image}
              alt=""
              className="mb-5 h-44 w-full rounded-2xl bg-[#F7F7F8] object-contain"
            />
            <p className="text-lg font-bold text-[#0B1354]">{product.title}</p>
            <p className="mt-1 text-xl font-extrabold text-[#111]">{product.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#545454]">{product.description}</p>
            <p className="mt-5 inline-flex rounded-lg border border-[#E4E4E7] bg-[#FAFAFB] px-3.5 py-2 text-sm font-bold tracking-wider text-[#3A3A3A]">
              {product.code}
            </p>
          </div>
        </>
      ) : null}
    </ModalShell>
  );
}
