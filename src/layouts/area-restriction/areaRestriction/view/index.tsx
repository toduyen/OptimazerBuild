import FormInfo from "components/customizes/Form/FormInfo";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import { Employee } from "../../../../models/base/employee";

function ViewAreaRestriction({
  handleClose,
  areaRestriction,
}: {
  handleClose: any;
  areaRestriction: any;
}) {
  return (
    <FormInfo title="Thông tin người dùng" handleClose={handleClose} enableUpdate={false}>
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Tên khu vực: {areaRestriction.areaName}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Max khu vực: {areaRestriction.areaCode}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Số nhân sự được phép ra vào:{" "}
            {areaRestriction.personnelAllowedInOut ? areaRestriction.personnelAllowedInOut : 0}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Nhân sự phụ trách:{" "}
            {areaRestriction.personnelInCharge.map((item: Employee) => item.name)}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Thời gian cho phép: {`${areaRestriction.timeStart} : ${areaRestriction.timeEnd}`}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Số camera: {areaRestriction.numberCamera ? areaRestriction.numberCamera : 0}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Số cảnh báo trong ngày:{" "}
            {areaRestriction.numberOfAlertsForTheDay ? areaRestriction.numberOfAlertsForTheDay : 0}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

export default ViewAreaRestriction;
