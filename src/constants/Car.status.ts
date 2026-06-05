export const WAITING = 'WAITING';
export const RULE_REJECTED = 'RULE_REJECTED';
export const INSPECTION_BOOKED = 'INSPECTION_BOOKED';
export const ADMIN_APPROVED = 'ADMIN_APPROVED';
export const ADMIN_REJECTED = 'ADMIN_REJECTED';
export const INSPECTED = 'INSPECTED';
export const INSPECTION_REJECTED = 'INSPECTION_REJECTED';
export const ACCEPT = 'ACCEPT';
export const USER_RESERVED = 'USER_RESERVED';
export const CC_REJECTED = 'CC_REJECTED';
export const FOLLOW_UP = 'FOLLOW_UP';
export const SHOWED_UP = 'SHOWED_UP';
export const SHOWUP_REJECTED = 'SHOWUP_REJECTED';
export const PRICING = 'PRICING';
export const NO_SHOW_UP = 'NO_SHOW_UP';
export const PRICE_ACCEPTED = 'PRICE_ACCEPTED';
export const PRICE_REJECTED = 'PRICE_REJECTED';
export const INBOUND_PURCHASE = 'INBOUND_PURCHASE';
export const CONTRACT_REJECTED = 'CONTRACT_REJECTED';
export const PUBLISHED_IN_3RD_PARTY = 'PUBLISHED_IN_3RD_PARTY';
export const PUBLISHED_IN_WEBSITE = 'PUBLISHED_IN_WEBSITE';
export const SOLD = 'SOLD';
export const FAILED = 'FAILED';
export const FINAL_REJECT = 'FINAL_REJECT';

export type CarsStatus =
  | typeof WAITING
  | typeof RULE_REJECTED
  | typeof INSPECTION_BOOKED
  | typeof ADMIN_APPROVED
  | typeof ADMIN_REJECTED
  | typeof INSPECTED
  | typeof INSPECTION_REJECTED
  | typeof ACCEPT
  | typeof USER_RESERVED
  | typeof CC_REJECTED
  | typeof FOLLOW_UP
  | typeof SHOWED_UP
  | typeof SHOWUP_REJECTED
  | typeof PRICING
  | typeof NO_SHOW_UP
  | typeof PRICE_ACCEPTED
  | typeof PRICE_REJECTED
  | typeof INBOUND_PURCHASE
  | typeof CONTRACT_REJECTED
  | typeof PUBLISHED_IN_3RD_PARTY
  | typeof PUBLISHED_IN_WEBSITE
  | typeof SOLD
  | typeof FAILED
  | typeof FINAL_REJECT;
