import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import ProfileItem from "../ProfileItem";
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";
import { logoutSuccess, useAuthenController } from "../../../context/authenContext";
import { CHANGE_PASSWORD_ROUTE, MAIN_ROUTE, SIGN_IN_ROUTE } from "../../../constants/route";
import IconButton from "@mui/material/IconButton";
import MDAvatar from "../../bases/MDAvatar";
import MDTypography from "../../bases/MDTypography";
import MDBox from "../../bases/MDBox";
import { User } from "../../../models/base/user";
import typography from "../../../assets/theme/base/typography";
import { Modal } from "@mui/material";
import MyProfile from "./myProfile";
import { hasMultiRole } from "../../../utils/checkRoles";

function ProfileMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenProfileMenu = (event: any) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  // @ts-ignore
  const [authController, authDispatch] = useAuthenController();
  const [currentUser, setCurrentUser] = useState<User>();
  const { size } = typography;
  useEffect(() => {
    if (authController.currentUser != null) {
      setCurrentUser(authController.currentUser);
    }
  }, [authController]);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = async () => {
    localStorage.clear();
    logoutSuccess(authDispatch);
    navigate(SIGN_IN_ROUTE);
  };
  const formView = (closeView: Function) => {
    if (currentUser !== undefined) {
      return <MyProfile handleClose={closeView} user={currentUser} />;
    }
    return <div />;
  };

  const renderProfileMenu = () => (
    <Menu
      // @ts-ignore
      anchorEl={openMenu}
      // @ts-ignore
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <ProfileItem
        icon={<Icon>person</Icon>}
        title="Xem thông tin cá nhân"
        onClick={() => {
          handleCloseMenu();
          setOpen(true);
        }}
      />
      {hasMultiRole(authController.currentUser) && (
        <ProfileItem
          icon={<Icon>arrow_back</Icon>}
          title="Quay lại trang chủ"
          onClick={() => {
            handleCloseMenu();
            localStorage.removeItem("module");
            navigate(MAIN_ROUTE);
          }}
        />
      )}
      <ProfileItem
        icon={<Icon>lock_reset</Icon>}
        title="Thay đổi mật khẩu"
        onClick={() => {
          navigate(CHANGE_PASSWORD_ROUTE);
        }}
      />
      <ProfileItem icon={<Icon>logout</Icon>} title="Đăng xuất" onClick={handleLogout} />
    </Menu>
  );
  return currentUser ? (
    <MDBox>
      <MDBox marginLeft={size.xl}>
        <IconButton
          sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          onClick={handleOpenProfileMenu}
        >
          <MDAvatar
            src={currentUser.avatar ? currentUser.avatar.path : ""}
            alt={currentUser.username}
            size="sm"
            shadow="sm"
          />
          <MDTypography variant="text" color="text" fontSize={size.xs} marginTop={size.xxs}>
            {currentUser.fullName}
          </MDTypography>
        </IconButton>
        {renderProfileMenu()}
      </MDBox>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{formView(handleClose)}</>
      </Modal>
    </MDBox>
  ) : (
    <div />
  );
}

export default ProfileMenu;
