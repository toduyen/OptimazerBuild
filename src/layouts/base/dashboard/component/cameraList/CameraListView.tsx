import { Checkbox, CircularProgress, Grid } from "@mui/material";
import {
  CAMERA_ORDER_CONFIG_LOCAL_STORAGE,
  CAMERA_STARTED_LOCAL_STORAGE,
  MAX_NUMBER_CAM_SHOW,
} from "constants/app";
import { Camera } from "models/base/camera";
import React, { useCallback, useEffect, useState } from "react";
import CameraOrderItems from "./CameraOrderItem";
import FormViewCamera from "./FormViewCamera";
import MDBox from "components/bases/MDBox";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthenController } from "../../../../../context/authenContext";
import { getAllCameraApi } from "../../../camera/api";

function FormCamera({ handleClose }: { handleClose: any }) {
  const [orderIndexList, setOrderIndexList] = useState<Array<number>>([]);
  const [cameraList, setCameraList] = useState<Array<Camera>>([]);
  const [isDisableCheckbox, setIsDisableCheckbox] = useState<boolean>(true);
  const listItemChecked: Array<any> = [];
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [token, setToken] = useState(null);
  const [isCheckAll, setIsCheckAll] = useState<boolean | null>(null);
  // @ts-ignore
  const [authController] = useAuthenController();

  useEffect(() => {
    if (authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const handleSaveData = () => {
    // Loop orderIndexList if item > 0 => add in result array : {came, orderIndex}
    orderIndexList.forEach((item: number, index: number) => {
      if (item > 0) {
        listItemChecked.push({
          camera: cameraList[index].id,
          orderIndex: item,
        });
      }
    });
    // Order result array to asc orderIndex
    listItemChecked.sort((a, b) => a.orderIndex - b.orderIndex);

    const newCameraStartedArray: Array<number> = listItemChecked.map((element) => element.camera);
    if (newCameraStartedArray.length === 0) {
      localStorage.removeItem(CAMERA_STARTED_LOCAL_STORAGE);
    } else {
      localStorage.setItem(CAMERA_STARTED_LOCAL_STORAGE, JSON.stringify(newCameraStartedArray));
    }
    localStorage.setItem(CAMERA_ORDER_CONFIG_LOCAL_STORAGE, JSON.stringify(listItemChecked));
    handleClose();
  };

  const handleUpdateIndex = (newIndex: number, newOrderIndex: number) => {
    if (
      orderIndexList.filter((item) => item > 0).length < parseInt(MAX_NUMBER_CAM_SHOW, 10) ||
      newOrderIndex === 0
    ) {
      // Re update orderIndexList
      orderIndexList[newIndex] = newOrderIndex;
    } else if (orderIndexList[newIndex] > 0) {
      orderIndexList[newIndex] = newOrderIndex;
    }
    setOrderIndexList(orderIndexList);
    setIsDisableCheckbox(
      orderIndexList.filter((item) => item > 0).length >= parseInt(MAX_NUMBER_CAM_SHOW, 10)
    );
  };

  const fetchData = useCallback(
    async ({ page, size, search, reset = false }) => {
      if (token) {
        const getAllCameraResponse = await getAllCameraApi({
          token,
          page,
          size,
          search,
          status: "active",
        });
        if (getAllCameraResponse.data !== null) {
          if (reset) {
            setCameraList(getAllCameraResponse.data.data);
          } else {
            setCameraList((prevState) => [...prevState, ...getAllCameraResponse.data.data]);
          }
          setTotalPage(getAllCameraResponse.data.pageCount);
          const cameraOrderConfig = localStorage.getItem(CAMERA_ORDER_CONFIG_LOCAL_STORAGE);
          if (cameraOrderConfig !== null) {
            const cameraOrderConfigArray: Array<any> = JSON.parse(cameraOrderConfig);
            if (cameraOrderConfigArray.length === getAllCameraResponse.data.itemCount) {
              setIsCheckAll(true);
            }
          }
        }
      }
    },
    [token]
  );

  // @ts-ignore
  useEffect(async () => {
    if (isCheckAll === true) {
      setOrderIndexList(cameraList.map((item: any) => 1));
    } else {
      const cameraOrderConfig = localStorage.getItem(CAMERA_ORDER_CONFIG_LOCAL_STORAGE);
      if (cameraOrderConfig !== null) {
        const cameraOrderConfigArray: Array<any> = JSON.parse(cameraOrderConfig);
        const result: Array<number> = [];

        cameraList.forEach((element: Camera, index) => {
          if (index < orderIndexList.length) {
            result.push(orderIndexList[index]);
          } else {
            const resultFilterCamera = cameraOrderConfigArray.filter(
              (item: any) => item.camera === element.id
            );
            if (resultFilterCamera.length > 0) {
              result.push(resultFilterCamera[0].orderIndex);
            } else {
              result.push(0);
            }
          }
        });

        setOrderIndexList(result);
      } else {
        setOrderIndexList(cameraList.map((item: any) => 0));
      }
    }
  }, [cameraList]);

  useEffect(() => {
    if (isCheckAll === true) {
      fetchData({ page: 0, size: 10 ** 6, reset: true }).catch(console.error);
    } else if (isCheckAll === false) {
      setOrderIndexList(cameraList.map((item: any) => 0));
    }
  }, [isCheckAll]);

  useEffect(() => {
    setIsDisableCheckbox(
      orderIndexList.filter((item) => item > 0).length >= parseInt(MAX_NUMBER_CAM_SHOW, 10)
    );
  }, [orderIndexList]);

  useEffect(() => {
    fetchData({ page: 0, size: 10 }).catch(console.error);
  }, [token]);

  const handleCheckAll = (event: any) => {
    setIsCheckAll(event.target.checked);
  };

  return (
    <FormViewCamera
      title="Chọn camera hiển thị dashboard"
      handleClose={handleClose}
      handleSaveData={handleSaveData}
    >
      <MDBox>
        <Grid container mb={2}>
          <Grid item xs={2} md={2} lg={2}>
            <Checkbox
              checked={isCheckAll ? isCheckAll : false}
              onChange={(event) => handleCheckAll(event)}
            />
          </Grid>
          <Grid item xs={5} md={5} lg={5}>
            Tên camera
          </Grid>
          <Grid item xs={5} md={5} lg={5}>
            Thứ tự hiển thị
          </Grid>
        </Grid>
        <div
          id="cameraListScroll"
          style={{ maxHeight: "55vh", overflowY: "auto", overflowX: "hidden" }}
        >
          <InfiniteScroll
            dataLength={orderIndexList.length}
            next={async () => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              await fetchData({ page: newPage, size: 10 });
            }}
            hasMore={currentPage < totalPage - 1}
            loader={
              <MDBox>
                <CircularProgress color="info" />
              </MDBox>
            }
            scrollableTarget="cameraListScroll"
            style={{ overflow: "unset" }}
          >
            {orderIndexList.map((item: number, index: number) => (
              <React.Fragment key={`${item}_${index}`}>
                <CameraOrderItems
                  camera={cameraList[index]}
                  index={index}
                  orderIndex={item}
                  isDisableCheckbox={isDisableCheckbox}
                  handleUpdateIndex={handleUpdateIndex}
                />
              </React.Fragment>
            ))}
          </InfiniteScroll>
        </div>
      </MDBox>
    </FormViewCamera>
  );
}

export default FormCamera;
