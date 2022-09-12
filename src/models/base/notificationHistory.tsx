import { Camera, convertResponseToCamera } from "./camera";
import { convertResponseToEmployee, Employee } from "./employee";
import { convertResponseToMetadata, Metadata } from "./metadata";
import { convertResponseToNotificationMethod, NotificationMethod } from "./notificationMethod";

export interface NotificationHistory {
  id: number;
  type: string;
  time: string;
  camera: Camera | null;
  employee: Employee | null;
  image: Metadata | null;
  status: string;
  notificationMethod: NotificationMethod | null;
}

export const convertResponseToNotificationHistory = (response: any) => ({
  id: response.id,
  type: response.type,
  time: response.time,
  camera: response.camera ? convertResponseToCamera(response.camera) : null,
  employee: response.employee ? convertResponseToEmployee(response.employee) : null,
  image: response.image ? convertResponseToMetadata(response.image) : null,
  status: response.status,
  notificationMethod: response.notification_method
    ? convertResponseToNotificationMethod(response.notification_method)
    : null,
});
