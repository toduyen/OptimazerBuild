import ImportComponent from "../../basePage/components/ImportComponent";
import React from "react";
import { showSnackbar, useSnackbarController } from "../../../../context/snackbarContext";
import { ERROR_TYPE, INFO_TYPE, SUCCESS_TYPE } from "../../../../constants/app";
import { uploadEmployeeApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";

export default function ImportEmployee() {
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  // @ts-ignore
  const [authController] = useAuthenController();

  const handleImport = async (files: any) => {
    showSnackbar(snackbarDispatch, {
      typeSnackbar: INFO_TYPE,
      messageSnackbar: "Đang xử lý dữ liệu, hãy chờ...",
      timeSnackbar: 1000000,
    });

    if (files) {
      const properties = Object.getOwnPropertyNames(files);
      const imageFiles: any[] = [];
      let excelFile = null;
      properties.forEach((item: string) => {
        const file = files[item];
        if (file.name.indexOf(".xlsx") > 0) {
          excelFile = file;
        } else {
          imageFiles.push(file);
        }
      });

      if (!excelFile) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: "Không tồn tại file excel chứa thông tin nhân viên",
        });
      } else if (imageFiles.length === 0) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: "Không có các file ảnh nhân viên",
        });
      } else {
        const uploadEmployeeResponse = await uploadEmployeeApi({
          token: authController.token,
          files: imageFiles,
          excelFile,
        });
        if (uploadEmployeeResponse.data) {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: "Thêm danh sách nhân viên thành công",
          });
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: uploadEmployeeResponse.messageError,
          });
        }
      }
    }
  };
  return <ImportComponent title="Thêm danh sách nhân viên" handleImport={handleImport} />;
}
