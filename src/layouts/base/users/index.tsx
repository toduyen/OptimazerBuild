import usersTableData from "layouts/base/users/data";
import React from "react";
import AddUser from "./add";
import EditFormUser from "./edit";
import ViewUser from "./view";
import BasePage from "../basePage";
import { deleteUserApi } from "./api";
import { deleteUserSuccess, useUserController } from "../../../context/userContext";
import { FilterFormUser } from "./components/FilterFormUser";

function Users(): React.ReactElement {
  // @ts-ignore
  const [, userDispatch] = useUserController();
  return (
    <BasePage
      tableTitle="Danh sách người dùng"
      tableData={usersTableData}
      AddForm={({ handleClose }) => AddUser({ handleClose })}
      EditForm={({ handleClose, item }) => EditFormUser({ handleClose, user: item })}
      ViewForm={({ handleClose, item }) => ViewUser({ handleClose, user: item })}
      FilterForm={FilterFormUser}
      deleteAction={{
        actionDelete: (id) => deleteUserSuccess(userDispatch, id),
        deleteApi: deleteUserApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableExport: false,
        enableImport: false,
      }}
    />
  );
}

export default Users;
