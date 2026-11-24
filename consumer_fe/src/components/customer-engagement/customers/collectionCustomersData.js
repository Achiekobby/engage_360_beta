export const SEGMENT_TAGS = [
  'New Customer',
  'Returning Customer',
  'Loyal Customer',
  'High Value Customer',
  'Inactive Customer',
];

export const SEGMENT_STYLES = {
  'New Customer': 'bg-[#EDE8F8] text-primary ring-primary/15',
  'Active Customer': 'bg-[#E8F8EF] text-[#1F9D55] ring-[#1F9D55]/20',
  'Returning Customer': 'bg-[#E8F4FC] text-[#2E7DAD] ring-[#2E7DAD]/20',
  'Loyal Customer': 'bg-[#FFF4E8] text-[#E67E22] ring-[#E67E22]/20',
  'High Value Customer': 'bg-[#F7F8FF] text-[#6B4FE0] ring-[#6B4FE0]/20',
  'High-Value Customer': 'bg-[#F7F8FF] text-[#6B4FE0] ring-[#6B4FE0]/20',
  'Inactive Customer': 'bg-[#F0F2F7] text-[#717171] ring-[#717171]/15',
  'At-Risk Customer': 'bg-[#FFF8E8] text-[#F5A623] ring-[#F5A623]/25',
  'Churned Customer': 'bg-[#FEECEC] text-[#E53935] ring-[#E53935]/20',
};

const SEGMENT_ALIASES = {
  'new customer': 'New Customer',
  'returning customer': 'Returning Customer',
  'loyal customer': 'Loyal Customer',
  'high value customer': 'High Value Customer',
  'inactive customer': 'Inactive Customer',
  'active customer': 'Active Customer',
  'at risk customer': 'At-Risk Customer',
  'churned customer': 'Churned Customer',
};

export function normalizeSegment(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const key = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  return SEGMENT_ALIASES[key] || (SEGMENT_STYLES[raw] ? raw : '');
}

export const FORM_OPTIONS = {
  genders: ['Male', 'Female', 'Other'],
  regions: ['Greater Accra', 'Ashanti Region', 'Western Region', 'Central Region'],
  locations: ['Abelemkpe', 'East Legon', 'Madina', 'Dzorwulu', 'Accra'],
  segments: SEGMENT_TAGS,
  categories: ['Electronics', 'Fashion', 'Hospitality', 'Finance'],
  subCategories: {
    Electronics: ['Mobile Phone', 'Laptop', 'Accessories'],
    Fashion: ['Apparel', 'Footwear'],
    Hospitality: ['Hotels', 'Restaurants'],
    Finance: ['Banking', 'Insurance'],
  },
};
