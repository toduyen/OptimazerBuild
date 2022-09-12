import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import FormInfo from "components/customizes/Form/FormInfo";
import { Camera } from "models/base/camera";
import { isTimeKeepingAdmin, isTimeKeepingModule } from "../../../../utils/checkRoles";
import { useAuthenController } from "../../../../context/authenContext";

function ViewCamera({ handleClose, camera }: { handleClose: any; camera: Camera }) {
  // @ts-ignore
  const [authController] = useAuthenController();
  return (
    <FormInfo title="Thông tin camera" handleClose={handleClose} enableUpdate={false}>
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Tên camera: {camera.name}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            {isTimeKeepingModule()
              ? `Chi nhánh: ${camera.location ? camera.location.name : "không có"}`
              : `Khu vực hạn chế: ${camera.areaRestriction ? camera.areaRestriction.areaName : "Không có"}`}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Link camera: {camera.ipAddress}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Check in/ Check out: {camera.type}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

export default ViewCamera;
