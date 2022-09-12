import Icon from "@mui/material/Icon";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import { Organization } from "models/base/organization";
import { useEffect, useState } from "react";
import { getAllOrganizationApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import {
  getAllOrganizationSuccess,
  useOrganizationController,
} from "../../../../context/organizationContext";

export default function data(
  handleView: (organization: Organization) => void,
  handleEdit: (organization: Organization) => void,
  handleDelete: (organization: Organization) => void
) {
  const [organizationDatas, setOrganizationDatas] = useState([]);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [organizationController, organizationDispatch] = useOrganizationController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      // Call api to get all organization
      const getAllOrganizationResponse = await getAllOrganizationApi(authController.token);
      // Update data to context (dispatch action)
      if (getAllOrganizationResponse.data != null) {
        getAllOrganizationSuccess(organizationDispatch, getAllOrganizationResponse.data);
      }
    }
  }, [authController.token]);

  const convertDataToRow = (organization: Organization) => ({
    name: organization.name,
    email: organization.email ? organization.email : "",
    phone: organization.phone ? organization.phone : "",
    description: organization.description ? organization.description : "",
    accountNumber: organization.numberUser ? organization.numberUser : 0,
    action: (
      <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDButton variant="text" color="info" onClick={() => handleView(organization)}>
          <RemoveRedEyeIcon />
          &nbsp;xem
        </MDButton>
        <MDButton variant="text" color="dark" onClick={() => handleEdit(organization)}>
          <Icon>edit</Icon>&nbsp;sửa
        </MDButton>
        <MDBox mr={1}>
          <MDButton variant="text" color="error" onClick={() => handleDelete(organization)}>
            <Icon>delete</Icon>&nbsp;xóa
          </MDButton>
        </MDBox>
      </MDBox>
    ),
  });

  useEffect(() => {
    // Get data from context and set for organzationDatas
    if (organizationController.organizations) {
      setOrganizationDatas(
        organizationController.organizations.map((organization: Organization) =>
          convertDataToRow(organization)
        )
      );
    }
  }, [organizationController.organizations]);
  return {
    columns: [
      { Header: "Tên tổ chức", accessor: "name", align: "left" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Số điện thoại", accessor: "phone", align: "center" },
      { Header: "Mô tả", accessor: "description", align: "center" },
      { Header: "Tổng số tài khoản", accessor: "accountNumber", align: "center" },
      { Header: "Thao tác", accessor: "action", align: "center", width: "20%" },
    ],

    rows: organizationDatas,
  };
}
