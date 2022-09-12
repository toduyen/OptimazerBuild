import { useCallback, useEffect, useState } from "react";
import { getAllLocationApi } from "../api";
import { Location } from "models/base/location";
import { Icon } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { getAllLocationSuccess, useLocationController } from "../../../../context/locationContext";
import { useAuthenController } from "../../../../context/authenContext";

export default function data(
  handleView: (location: Location) => void,
  handleEdit: (location: Location) => void,
  handleDelete: (location: Location) => void
) {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [rowTableData, setRowTableData] = useState([]);
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [locationController, locationDispatch] = useLocationController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size, search }) => {
      if (token) {
        const getAllLocationResponse = await getAllLocationApi({ token, page, size, search });
        if (getAllLocationResponse.data !== null) {
          getAllLocationSuccess(locationDispatch, getAllLocationResponse.data.data);
          setPageCount(getAllLocationResponse.data.pageCount);
          setItemCount(getAllLocationResponse.data.itemCount);
        }
      }
    },
    [token]
  );

  const convertDataToRow = (location: Location) => ({
    locationName: location.name,
    branchCode: location.code,
    numberOfPersonnel: location.numberEmployee,
    numberCamera: location.numberCamera,
    action: (
      <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDButton variant="text" color="info" onClick={() => handleView(location)}>
          <RemoveRedEyeIcon />
          &nbsp;xem
        </MDButton>
        <MDButton variant="text" color="dark" onClick={() => handleEdit(location)}>
          <Icon>edit</Icon>&nbsp;sửa
        </MDButton>
        <MDBox mr={1}>
          <MDButton variant="text" color="error" onClick={() => handleDelete(location)}>
            <Icon>delete</Icon>&nbsp;xóa
          </MDButton>
        </MDBox>
      </MDBox>
    ),
  });

  useEffect(() => {
    if (locationController.locations) {
      setRowTableData(
        locationController.locations.map((location: Location) => convertDataToRow(location))
      );
    }
  }, [locationController.locations]);

  return {
    columns: [
      { Header: "Tên chi nhánh", accessor: "locationName", align: "center" },
      { Header: "Mã chi nhánh", accessor: "branchCode", align: "center" },
      { Header: "Số nhân sự", accessor: "numberOfPersonnel", align: "center" },
      { Header: "Số camera", accessor: "numberCamera", align: "center" },
      { Header: "Thao tác", accessor: "action", align: "center" },
    ],

    rows: rowTableData,
    fetchData,
    pageCount,
    itemCount,
  };
}
