import { convertResponseToLocation, Location } from "./location";
import {
  AreaRestriction,
  convertResponseToAreaRestriction,
} from "../area-restriction/areaRestriction";

export interface Camera {
  id: number;
  name: string;
  location: Location | null;
  areaRestriction: AreaRestriction | null;
  ipAddress: string;
  type: string;
  status: string;
  taken: string;
}

export const convertResponseToCamera = (response: any) => ({
  id: response.id,
  name: response.name,
  location: response.location ? convertResponseToLocation(response.location) : null,
  areaRestriction: response.area_restriction
    ? convertResponseToAreaRestriction(response.area_restriction)
    : null,
  ipAddress: response.ip_address,
  type: response.type,
  status: response.status,
  taken: response.taken,
});
