import Images from '../../utils/Images';

const DESCRIPTION =
  'Limited-time Boxing Day pricing on selected styles. Use code FLASH50 at checkout. The offer applies after you redeem, and it ends when the countdown hits zero.';

function offerEndsAt() {
  const end = new Date();
  end.setDate(end.getDate() + 4);
  end.setHours(end.getHours() + 8);
  return end.getTime();
}

export const OFFER_ENDS_AT = offerEndsAt();

export const RECIPIENT_OFFER = {
  brand: 'Engage360',
  contactPhone: '+23354517993',
  contactEmail: 'hello@engage360.com',
  banner: Images.platform_services.sample_banner,
  productImage: Images.platform_services.sample_product,
  rewards: [
    'FLASH50 unlocks 50% off eligible items',
    'One redemption per recipient',
    'Valid until the promo countdown ends',
  ],
};

export const OFFER_PRODUCTS = Array.from({ length: 6 }, (_, index) => ({
  id: `summer-flash-${index + 1}`,
  title: 'Exclusive Summer Flash sale',
  price: '$1,499',
  redeemLabel: 'Redeems after',
  code: 'FLASH50',
  image: Images.platform_services.sample_product,
  description: DESCRIPTION,
}));
