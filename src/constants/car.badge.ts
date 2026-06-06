export const BadgeInspected = 'INSPECTED';
export const BadgeContentCreated = 'CONTENT_CREATED';
export const BadgeChecklistDone = 'CHECKLIST_DONE';
export const BadgePricingDone = 'PRICING_DONE';
export const BadgeSalesPricingDone = 'SALES_PRICING_DONE';
export const BadgeKHPricingDone = 'KH_PRICING_DONE';

export type CarBadge =
  | typeof BadgeInspected
  | typeof BadgeContentCreated
  | typeof BadgeChecklistDone
  | typeof BadgePricingDone
  | typeof BadgeSalesPricingDone
  | typeof BadgeKHPricingDone;
