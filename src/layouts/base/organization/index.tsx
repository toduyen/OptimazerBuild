import React from "react";
import AddOrganization from "./add";
import organizationTableData from "./data";
import EditFormOrganization from "./edit";
import ViewOrganization from "./view";
import BasePage from "../basePage";
import { deleteOrganizationApi } from "./api";
import {
  deleteOrganizationSuccess,
  useOrganizationController,
} from "../../../context/organizationContext";

function Organizations(): React.ReactElement {
  // @ts-ignore
  const [, organizationDispatch] = useOrganizationController();
  return (
    <BasePage
      tableTitle="Danh sách tổ chức"
      tableData={organizationTableData}
      AddForm={({ handleClose }) => AddOrganization({ handleClose })}
      EditForm={({ handleClose, item }) =>
        EditFormOrganization({ handleClose, organization: item })
      }
      ViewForm={({ handleClose, item }) => ViewOrganization({ handleClose, organization: item })}
      deleteAction={{
        actionDelete: (id) => deleteOrganizationSuccess(organizationDispatch, id),
        deleteApi: deleteOrganizationApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableImport: false,
        enableExport: false,
      }}
    />
  );
}

export default Organizations;
