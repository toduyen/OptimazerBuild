import {
  convertNotificationMethodToRequest,
  convertResponseToNotificationMethod,
  NotificationMethod,
} from "../base/notificationMethod";

export interface TimeKeepingNotification {
  id: number;
  lateTime: number;
  lateInWeek: number;
  lateInMonth: number;
  lateInQuarter: number;
  notificationMethod: NotificationMethod;
  startDayOfWeek: number;
  endDayOfWeek: number;
}

export const convertResponseToTimeKeepingNotification = (
  response: any
): TimeKeepingNotification => ({
  id: response.id,
  lateTime: response.late_time,
  lateInWeek: response.late_in_week,
  lateInQuarter: response.late_in_quarter,
  lateInMonth: response.late_in_month,
  notificationMethod: convertResponseToNotificationMethod(response.notification_method),
  startDayOfWeek: response.start_day_of_week,
  endDayOfWeek: response.end_day_of_week,
});

export const convertTimeKeepingNotificationToRequest = (
  timeKeepingNotification: TimeKeepingNotification
): Object => ({
  id: timeKeepingNotification.id,
  late_time: timeKeepingNotification.lateTime,
  late_in_week: timeKeepingNotification.lateInWeek,
  late_in_month: timeKeepingNotification.lateInMonth,
  late_in_quarter: timeKeepingNotification.lateInQuarter,
  ...convertNotificationMethodToRequest(timeKeepingNotification.notificationMethod),
  start_day_of_week: timeKeepingNotification.startDayOfWeek,
  end_day_of_week: timeKeepingNotification.endDayOfWeek,
});
