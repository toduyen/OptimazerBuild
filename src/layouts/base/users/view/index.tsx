import FormInfo from "components/customizes/Form/FormInfo";
import { User } from "models/base/user";
import React from "react";
import MDAvatar from "components/bases/MDAvatar";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
// @ts-ignore
import avatarDefault from "assets/images/avatar_default.png";

function ViewUser({ handleClose, user }: { handleClose: any; user: User }) {
  return (
    <FormInfo title="Thông tin người dùng" handleClose={handleClose} enableUpdate={false}>
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" justifyContent="center" paddingBottom="41px">
          <MDAvatar
            src={user.avatar ? user.avatar.path : avatarDefault}
            alt={user.fullName}
            size="xxl"
            shadow="md"
          />
        </MDBox>
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Họ và tên: {user.fullName}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Email: {user.email}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Tổ chức: {user.organization?.name}
          </MDTypography>
          {user.location && (
            <MDTypography variant="text" color="text" fontSize="14px">
              Chi nhánh: {user.location?.name}
            </MDTypography>
          )}
          <MDTypography variant="text" color="text" fontSize="14px">
            Quyền: {user.roles.map((role) => `${role.name} `)}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

export default ViewUser;
