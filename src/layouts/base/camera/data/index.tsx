import React, { useCallback, useEffect, useState } from "react";
import { getAllCameraApi } from "../api";
import { Camera } from "models/base/camera";
import { Icon } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useAuthenController } from "../../../../context/authenContext";
import { getAllCameraSuccess, useCameraController } from "../../../../context/cameraContext";
import { isTimeKeepingModule } from "../../../../utils/checkRoles";
import { convertStatusToString } from "utils/helpers";
import RowAction from "components/customizes/Tables/RowAction";

export default function data(
  handleView: (camera: Camera) => void,
  handleEdit: (camera: Camera) => void,
  handleDelete: (camera: Camera) => void,
  handleSetting: (camera: Camera) => void
) {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const [rowTableDatas, setRowTableData] = useState([]);
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [cameraController, cameraDispatch] = useCameraController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size, search }) => {
      if (token) {
        const areaRestrictionId = cameraController.filter.areaRestriction
          ? cameraController.filter.areaRestriction.id
          : "";
        const status = cameraController.filter.status
          ? cameraController.filter.status === "Đã xóa"
            ? "deleted"
            : "active"
          : "";
        const locationId = cameraController.locationChoosed
          ? cameraController.locationChoosed.id
          : isTimeKeepingModule()
          ? ""
          : authController.currentUser.location.id;
        const getAllCamerasResponse = await getAllCameraApi({
          token: authController.token,
          page,
          size,
          search,
          areaRestrictionId,
          locationId,
          status,
        });
        if (getAllCamerasResponse.data !== null) {
          getAllCameraSuccess(cameraDispatch, getAllCamerasResponse.data.data);
          setPageCount(getAllCamerasResponse.data.pageCount);
          setItemCount(getAllCamerasResponse.data.itemCount);
        }
      }
    },
    [token, cameraController.filter, cameraController.locationChoosed]
  );

  const convertDataToRow = (camera: Camera) => ({
    cameraName: camera.name,
    location: isTimeKeepingModule()
      ? camera.location
        ? camera.location?.name
        : `Không có chi nhánh`
      : camera.areaRestriction
      ? camera.areaRestriction.areaName
      : `Không có`,
    ipAddress: camera.ipAddress,
    typeCamera: camera.type,
    setting:
      camera.status === "active" ? (
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          <MDButton variant="text" color="info" onClick={() => handleSetting(camera)}>
            <Icon>settings</Icon>
            &nbsp;Cài đặt
          </MDButton>
        </MDBox>
      ) : (
        <div />
      ),
    status: convertStatusToString(camera.status),
    action:
      camera.status === "active" ? (
        <RowAction
          handleView={() => handleView(camera)}
          handleEdit={() => handleEdit(camera)}
          handleDelete={() => handleDelete(camera)}
        />
      ) : (
        <div />
      ),
  });

  useEffect(() => {
    if (cameraController.cameras) {
      setRowTableData(cameraController.cameras.map((camera: Camera) => convertDataToRow(camera)));
    }
  }, [cameraController.cameras]);

  return {
    columns: isTimeKeepingModule()
      ? [
          { Header: "Tên camera", accessor: "cameraName", align: "center" },
          { Header: "Chi nhánh", accessor: "location", align: "center" },
          { Header: "Link rtsp camera", accessor: "ipAddress", align: "center" },
          { Header: "Check in/Check out", accessor: "typeCamera", align: "center" },
          { Header: "Trạng thái", accessor: "status", align: "center" },
          { Header: "Thao tác", accessor: "action", align: "center" },
        ]
      : [
          { Header: "Tên camera", accessor: "cameraName", align: "center" },
          { Header: "Khu vực hạn chế", accessor: "location", align: "center" },
          { Header: "Link rtsp camera", accessor: "ipAddress", align: "center" },
          { Header: "Cài đặt camera", accessor: "setting", align: "center" },
          { Header: "Trạng thái", accessor: "status", align: "center" },
          { Header: "Thao tác", accessor: "action", align: "center" },
        ],
    rows: rowTableDatas,
    fetchData,
    pageCount,
    itemCount,
  };
}
