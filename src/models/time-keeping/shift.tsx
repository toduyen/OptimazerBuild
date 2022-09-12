export interface Shift {
  id: number;
  name: string;
  timeStart: string;
  timeEnd: string;
}

export const convertResponseToShift = (response: any): Shift => ({
  id: response.id,
  name: response.name,
  timeStart: response.time_start,
  timeEnd: response.time_end,
});

export const convertShiftToRequest = (shift: Shift): Object => ({
  id: shift.id,
  name: shift.name,
  time_start: shift.timeStart,
  time_end: shift.timeEnd,
});
