import { Grid, Icon, Popper } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDTimePicker from "components/bases/MDTimePicker";
import { useEffect, useState } from "react";
import { AreaEmployeeTimeType } from "types/areaEmployeeTimeType";
import AreaRestrictionAutocomplete from "../../../area-restriction/areaRestriction/components/AreaRestrictionAutocomplete";
import { AreaRestriction } from "../../../../models/area-restriction/areaRestriction";

const styles = () => ({
  popper: {
    width: "fit-content",
  },
});
const PopperMy = function (props: any) {
  // @ts-ignore
  return <Popper {...props} style={styles.popper} placement="bottom-start" />;
};

export default function AreaRestrictionTime({
  areaRestrictionTime,
  position,
  handleUpdate,
}: {
  areaRestrictionTime: AreaEmployeeTimeType;
  position: number;
  handleUpdate: (index: number, newValue: AreaEmployeeTimeType | null) => void;
}) {
  const [timeStart, setTimeStart] = useState<Date | null>(areaRestrictionTime.timeStart);
  const [timeEnd, setTimeEnd] = useState<Date | null>(areaRestrictionTime.timeEnd);
  const [areaRestriction, setAreaRestriction] = useState<AreaRestriction | null>(
    areaRestrictionTime.areaRestriction
  );

  useEffect(() => {
    setTimeStart(areaRestrictionTime.timeStart);
    setTimeEnd(areaRestrictionTime.timeEnd);
    setAreaRestriction(areaRestrictionTime.areaRestriction);
  }, [areaRestrictionTime]);

  useEffect(() => {
    handleUpdate(position, {
      areaRestriction,
      timeStart,
      timeEnd,
    });
  }, [timeStart, timeEnd, areaRestriction]);

  const handleChangeStartTime = (time: Date | null) => {
    setTimeStart(time);
  };

  const handleChangeEndTime = (time: Date | null) => {
    setTimeEnd(time);
  };

  const handleRemoveItem = () => {
    handleUpdate(position, null);
  };

  return (
    <MDBox
      key={
        areaRestrictionTime.areaRestriction
          ? areaRestrictionTime.areaRestriction.areaName + position
          : position
      }
    >
      <Grid container spacing={1} className="area-restriction-time">
        <Grid item xs={4} md={4} lg={4}>
          <AreaRestrictionAutocomplete
            PopperComponent={PopperMy}
            minWidth={0}
            wrapperTextFieldClassName="area-restriction-autocomplete"
            label="Khu vực"
            type="autocomplete"
            defaultData={areaRestriction ? Array.of(areaRestriction) : []}
            handleChoose={(areaRestrictions) => {
              if (areaRestrictions.length > 0) {
                setAreaRestriction(areaRestrictions[0]);
              } else setAreaRestriction(null);
            }}
          />
        </Grid>
        <Grid item xs={3.5} md={3.5} lg={3.5}>
          <MDTimePicker
            label="Bắt đầu"
            time={timeStart}
            handleChooseTime={(time: any) => handleChangeStartTime(time)}
          />
        </Grid>
        <Grid item xs={3.5} md={3.5} lg={3.5}>
          <MDTimePicker
            label="Kết thúc"
            time={timeEnd}
            handleChooseTime={(time: any) => handleChangeEndTime(time)}
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1}>
          <MDBox
            onClick={() => handleRemoveItem()}
            height="100%"
            display="flex"
            alignItems="center"
          >
            <Icon color="error">remove_circle</Icon>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
