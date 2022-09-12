import { Grid, Icon } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDInput from "components/bases/MDInput";
import { Employee } from "models/base/employee";
import { useEffect, useState } from "react";
import { AreaSettingReportType } from "types/areaSetingReport";
import EmployeeAutocomplete from "layouts/base/employees/components/EmployeeAutocomplete";

function ManagerTimeSkipItem({
  handleUpdateReport,
  position,
  item,
}: {
  handleUpdateReport: (index: number, newValue: AreaSettingReportType | null) => void;
  position: number;
  item: AreaSettingReportType;
}) {
  const [manager, setManager] = useState<Employee | null>(item.staff);
  const [time, setTime] = useState<number | null>(item.timeReport);

  const handleChangeTime = (e: any) => {
    setTime(e.target.value);
  };

  useEffect(() => {
    setTime(item.timeReport);
    setManager(item.staff);
  }, [item]);

  useEffect(() => {
    if (time !== null) {
      handleUpdateReport(position, {
        staff: manager,
        timeReport: time,
      });
    }
  }, [manager, time]);
  const handleRemoveItem = () => {
    handleUpdateReport(position, null);
  };
  return (
    <Grid container mb={3} style={{ fontSize: "13px" }} key={position} spacing={2}>
      <Grid item xs={6} md={6} lg={6} className="area-restriction-setting">
        <MDBox mb={2}>
          <EmployeeAutocomplete
            defaultData={manager ? Array.of(manager) : null}
            type="autocomplete"
            label="Nhân viên cảnh báo"
            handleChoose={(employees) => {
              if (employees.length > 0) {
                setManager(employees[0]);
              } else setManager(null);
            }}
            status="active"
            minWidth={0}
          />
        </MDBox>
      </Grid>
      <Grid item xs={4} md={4} lg={4}>
        Sau{" "}
        <MDInput
          style={{ width: "50px" }}
          value={time}
          onChange={(e: any) => handleChangeTime(e)}
        />{" "}
        phút
      </Grid>
      <Grid item xs={2} md={2} lg={2}>
        <MDBox
          onClick={() => handleRemoveItem()}
          height="100%"
          display="flex"
          alignItems="center"
          justifyConten="center"
          fontSize="20px"
        >
          <Icon color="error">remove_circle</Icon>
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default ManagerTimeSkipItem;
