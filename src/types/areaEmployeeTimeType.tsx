import { AreaRestriction } from "../models/area-restriction/areaRestriction";

export type AreaEmployeeTimeType = {
  areaRestriction: AreaRestriction | null;
  timeStart: Date | null;
  timeEnd: Date | null;
};
