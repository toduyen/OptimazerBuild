import { AreaRestriction, convertResponseToAreaRestriction } from "./areaRestriction";
import {
  convertNotificationMethodToRequest,
  convertResponseToNotificationMethod,
  NotificationMethod,
} from "../base/notificationMethod";
import { convertResponseToManagerTimeSkip, ManagerTimeSkip } from "./managerTimeSkip";

export interface AreaRestrictionNotification {
  id: number;
  areaRestriction: AreaRestriction;
  notificationMethod: NotificationMethod;
  managers: Array<ManagerTimeSkip> | null;
}

export const convertResponseToAreaRestrictionNotification = (response: any) => ({
  id: response.id,
  areaRestriction: convertResponseToAreaRestriction(response.area_restriction),
  notificationMethod: convertResponseToNotificationMethod(response.notification_method),
  managers: response.managers
    ? response.managers.map((element: any) => convertResponseToManagerTimeSkip(element))
    : null,
});

export const convertAreaRestrictionNotificationToRequest = (
  areaRestrictionNotification: AreaRestrictionNotification
): Object => ({
  ...convertNotificationMethodToRequest(
    areaRestrictionNotification.notificationMethod
  ),
  manager_times: areaRestrictionNotification.managers ? areaRestrictionNotification.managers.map((item: ManagerTimeSkip) => ({
    manager_id: item.manager ? item.manager.id : null,
    time_skip: item.timeSkip,
  })) : []
});
