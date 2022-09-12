export interface NotificationMethod {
  useOTT: boolean;
  useEmail: boolean;
  useScreen: boolean;
  useRing: boolean;
}

export const convertResponseToNotificationMethod = (response: any) => ({
  useOTT: response.use_ott,
  useEmail: response.use_email,
  useScreen: response.use_screen,
  useRing: response.use_ring,
});

export const convertNotificationMethodToRequest = (
  notificationMethod: NotificationMethod
): Object => ({
  use_ott: notificationMethod.useOTT,
  use_email: notificationMethod.useEmail,
  use_screen: notificationMethod.useScreen,
  use_ring: notificationMethod.useRing,
});
