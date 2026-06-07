export type CommonState = {
  currentRouteKey: string;
  notificationCount: number;
  salesRequestsWaitingCount: number;
};

export const initialCommonState: CommonState = {
  currentRouteKey: '',
  notificationCount: 0,
  salesRequestsWaitingCount: 0,
};
