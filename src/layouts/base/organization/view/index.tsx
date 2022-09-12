import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import FormInfo from "components/customizes/Form/FormInfo";
import { Organization } from "models/base/organization";

function ViewOrganization({
  handleClose,
  organization,
}: {
  handleClose: any;
  organization: Organization;
}) {
  return (
    <FormInfo title="Thông tin tổ chức" handleClose={handleClose} enableUpdate={false}>
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Tên tổ chức: {organization.name}
          </MDTypography>
          {organization.email && (
            <MDTypography variant="text" color="text" fontSize="14px">
              Email: {organization.email}
            </MDTypography>
          )}
          {organization.phone && (
            <MDTypography variant="text" color="text" fontSize="14px">
              Số điện thoại: {organization.phone}
            </MDTypography>
          )}
          {organization.description && (
            <MDTypography variant="text" color="text" fontSize="14px">
              Mô tả: {organization.description}
            </MDTypography>
          )}
          <MDTypography variant="text" color="text" fontSize="14px">
            Tổng số tài khoản: {organization.numberUser ? organization.numberUser : "0"}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

export default ViewOrganization;
