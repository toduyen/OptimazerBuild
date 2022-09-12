// Material Dashboard 2 React components
import { Role } from "models/base/role";
import React, { useEffect, useState } from "react";
// @ts-ignore
import MDBox from "components/bases/MDBox";

import { getAllRoleApi, getAllUserApi, reSendCodeUserApi } from "layouts/base/users/api";
import { User } from "models/base/user";
import { getAllOrganizationApi } from "../../organization/api";
import { useAuthenController } from "../../../../context/authenContext";
import { getAllUserSuccess, useUserController } from "../../../../context/userContext";
import { getAllRoleSuccess, useRoleController } from "../../../../context/roleContext";
import {
  getAllOrganizationSuccess,
  useOrganizationController,
} from "../../../../context/organizationContext";
import RowAction from "../../../../components/customizes/Tables/RowAction";
import { convertStatusToString } from "utils/helpers";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { SUCCESS_TYPE, ERROR_TYPE } from "constants/app";

export default function data(
  handleView: (user: User) => void,
  handleEdit: (user: User) => void,
  handleDelete: (user: User) => void
) {
  const [userDatas, setUserDatas] = useState([]);
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [userController, userDispatch] = useUserController();
  // @ts-ignore
  const [roleController, roleDispatch] = useRoleController();
  // @ts-ignore
  const [, organizationDispatch] = useOrganizationController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const convertStatus = () => {
    if (userController.filter.status === "Đã xóa") {
      return "deleted";
    }
    if (userController.filter.status === "Đang hoạt động") {
      return "active";
    }
    if (userController.filter.status === "Đang chờ xác nhận") {
      return "pending";
    } else return "";
  };

  // @ts-ignore
  useEffect(async () => {
    const status = convertStatus();
    if (authController.token) {
      const [getAllUserResponse, getAllOrganizationResponse, getAllRoleResponse] =
        await Promise.all([
          getAllUserApi({ token: authController.token, status }),
          getAllOrganizationApi(authController.token),
          getAllRoleApi(authController.token),
        ]);

      if (getAllUserResponse.data != null) {
        getAllUserSuccess(userDispatch, getAllUserResponse.data);
      }

      if (getAllRoleResponse.data != null) {
        getAllRoleSuccess(roleDispatch, getAllRoleResponse.data);
      }

      if (getAllOrganizationResponse.data != null) {
        getAllOrganizationSuccess(organizationDispatch, getAllOrganizationResponse.data);
      }
    }
    // localStorage.clear();
  }, [authController.token, userController.filter.status]);

  const hasRole = (user: User, role: Role) => {
    let userHasRole = false;
    user.roles.forEach((item: Role) => {
      if (item.id === role.id) {
        userHasRole = true;
      }
    });
    return userHasRole;
  };

  const confirmReSendCode = async (user: User) => {
    if (user) {
      const reSendCodeResponse = await reSendCodeUserApi({
        token: authController.token,
        id: user.id,
      });
      if (reSendCodeResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: "Đã gửi lại mã, vào mail để kiểm tra.",
        });
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: reSendCodeResponse.messageError,
        });
      }
    }
  };

  const renderUserRoles = (user: User) => {
    const userRoleItems: Array<React.ReactElement> = [];
    roleController.roles.forEach((role: Role) => {
      if (hasRole(user, role)) {
        userRoleItems.push(<MDBox sx={{ display: "block", margin: "0 10px" }}>{role.name}</MDBox>);
      }
    });
    return userRoleItems;
  };

  const convertDataToRow = (user: User) => ({
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    organization: user.organization === null ? "" : user.organization.name,
    roles: <div>{renderUserRoles(user)}</div>,
    status: convertStatusToString(user.status),
    action:
      user.status === "deleted" ? (
        <div />
      ) : (
        <RowAction
          handleView={() => handleView(user)}
          handleEdit={() => handleEdit(user)}
          handleDelete={() => handleDelete(user)}
          handleReSendCode={() => confirmReSendCode(user)}
        />
      ),
  });

  useEffect(() => {
    if (userController.users) {
      setUserDatas(userController.users.map((user: User) => convertDataToRow(user)));
    }
  }, [userController.users, roleController.roles]);

  return {
    columns: [
      { Header: "Tên đăng nhập", accessor: "username", align: "center" },
      { Header: "Họ và tên", accessor: "fullName", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Tổ chức", accessor: "organization", align: "center" },
      { Header: "Quyền quản lý", accessor: "roles", align: "center" },
      { Header: "Trạng thái", accessor: "status", align: "center" },
      { Header: "Thao tác", accessor: "action", align: "center" },
    ],

    rows: userDatas,
  };
}
