import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipientOfferNavbar from '../components/recipient-offer/RecipientOfferNavbar';
import RecipientOfferFooter from '../components/recipient-offer/RecipientOfferFooter';
import OfferProductCard from '../components/recipient-offer/OfferProductCard';
import OfferDetailsDialog from '../components/recipient-offer/OfferDetailsDialog';
import RewardFlow from '../components/recipient-offer/reward-flow/RewardFlow';
import { OFFER_ENDS_AT, OFFER_PRODUCTS, RECIPIENT_OFFER } from '../components/recipient-offer/offerData';
import useCountdown from '../hooks/useCountdown';
import useRecipient from '../hooks/useRecipient';

const AUTO_PROMPT_DELAY_MS = 2500;

export default function RecipientOfferPage() {
  const countdown = useCountdown(OFFER_ENDS_AT);
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerified, wallet } = useRecipient();

  const [flowOpen, setFlowOpen] = useState(Boolean(location.state?.openRewards));
  const [flowNotice] = useState(location.state?.notice || '');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // True once the flow has been opened by anything, so the timed prompt never fires twice.
  const [autoPrompted, setAutoPrompted] = useState(Boolean(location.state?.openRewards));

  // The guard sends people here with router state; clear it so a refresh doesn't reopen the flow.
  useEffect(() => {
    if (location.state?.openRewards) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  // First-time visitors get the verification prompt a moment after landing, once.
  useEffect(() => {
    if (isVerified || autoPrompted || flowOpen) return undefined;
    const timer = window.setTimeout(() => {
      setAutoPrompted(true);
      setFlowOpen(true);
    }, AUTO_PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isVerified, autoPrompted, flowOpen]);

  const handleRewards = useCallback(() => {
    if (isVerified) navigate('/rewards');
    else {
      setAutoPrompted(true);
      setFlowOpen(true);
    }
  }, [isVerified, navigate]);

  const handleViewDetails = useCallback((product) => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  }, []);

  return (
    <div id="offer-top" className="min-h-screen bg-[#F6F7FB] text-[#111]">
      <RecipientOfferNavbar onRewards={handleRewards} points={isVerified ? wallet.balance : null} />

      <main>
        <section className="bg-white">
          <div className="mx-auto w-full max-w-8xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <img
              src={RECIPIENT_OFFER.banner}
              alt="Engage360 exclusive discounts, up to 50 percent off"
              className="h-auto w-full rounded-xl object-cover shadow-[0_10px_30px_rgba(11,19,84,0.08)]"
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFER_PRODUCTS.map((product) => (
              <OfferProductCard
                key={product.id}
                product={product}
                countdown={countdown}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </section>
      </main>

      <RecipientOfferFooter />

      <RewardFlow open={flowOpen} onClose={() => setFlowOpen(false)} notice={flowNotice} />
      <OfferDetailsDialog product={selectedProduct} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </div>
  );
}
