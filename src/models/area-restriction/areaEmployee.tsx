import { AreaRestriction, convertResponseToAreaRestriction } from "./areaRestriction";

export interface AreaEmployee {
  id: number;
  areaRestriction: AreaRestriction;
  timeStart: string;
  timeEnd: string;
}

export const convertResponseToAreaEmployee = (response: any): AreaEmployee => ({
  id: response.id,
  areaRestriction: convertResponseToAreaRestriction(response.area_restriction),
  timeStart: response.time_start,
  timeEnd: response.time_end,
});

