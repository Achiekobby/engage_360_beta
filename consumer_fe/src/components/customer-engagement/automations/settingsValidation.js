import * as Yup from 'yup';

const moneyField = Yup.string()
  .trim()
  .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (e.g. 50 or 50.00)');

export const automationSettingsSchema = Yup.object({
  enabled: Yup.boolean(),
  approvalOption: Yup.string().required('Select a birthday approval option'),
  alertDays: Yup.string().required('Select how many days before to alert'),
  sendingTime: Yup.string().required('Select a birthday sending time'),
  channel: Yup.string().required('Select a channel'),
  title: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(80, 'Title must be 80 characters or less')
    .required('Offer title is required'),
  callToAction: Yup.string().required('Select a call to action'),
  customCtaLabel: Yup.string().when('callToAction', {
    is: 'other',
    then: (schema) =>
      schema
        .trim()
        .min(2, 'Custom CTA must be at least 2 characters')
        .max(40, 'Custom CTA must be 40 characters or less')
        .required('Enter your custom call to action'),
    otherwise: (schema) => schema.trim().notRequired(),
  }),
  ctaLink: Yup.string().when('callToAction', {
    is: (value) => Boolean(value),
    then: (schema) =>
      schema
        .trim()
        .url('Enter a valid URL (include https://)')
        .required('CTA link is required'),
    otherwise: (schema) => schema.trim().notRequired(),
  }),
  message: Yup.string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be 500 characters or less')
    .required('Birthday message is required'),
  offerSetup: Yup.string()
    .oneOf(['offer-setup', 'attachment-only', 'message-only'])
    .required('Select an offer set-up option'),
  description: Yup.string().when('offerSetup', {
    is: 'offer-setup',
    then: (schema) =>
      schema
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .required('Offer description is required'),
    otherwise: (schema) => schema.trim().notRequired(),
  }),
  offerVisual: Yup.string().when('offerSetup', {
    is: 'offer-setup',
    then: (schema) => schema.required('Select an offer visual'),
    otherwise: (schema) => schema.notRequired(),
  }),
  voucherCode: Yup.string()
    .trim()
    .max(40, 'Voucher code must be 40 characters or less'),
  offerExpiryDate: Yup.string().when('offerSetup', {
    is: 'offer-setup',
    then: (schema) =>
      schema
        .required('Select an offer expiry date')
        .test('future-date', 'Expiry date must be today or later', (value) => {
          if (!value) return false;
          const selected = new Date(`${value}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selected >= today;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  price: Yup.string().when('offerSetup', {
    is: 'offer-setup',
    then: () => moneyField.required('Price is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  discountedPrice: Yup.string().when('offerSetup', {
    is: 'offer-setup',
    then: () =>
      moneyField
        .required('Discounted price is required')
        .test(
          'lte-price',
          'Discounted price must be less than or equal to price',
          function validateDiscount(value) {
            const { price } = this.parent;
            if (!value || !price) return true;
            return Number(value) <= Number(price);
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  bannerName: Yup.string(),
  attachmentType: Yup.string().when('offerSetup', {
    is: 'attachment-only',
    then: (schema) => schema.required('Select an attachment type'),
    otherwise: (schema) => schema.notRequired(),
  }),
  attachmentName: Yup.string().when('offerSetup', {
    is: 'attachment-only',
    then: (schema) => schema.required('Upload an attachment to continue'),
    otherwise: (schema) => schema.notRequired(),
  }),
  extraAttachments: Yup.array().of(Yup.string()),
});
