import React, { useEffect, useState } from "react";
import DashboardTable from "components/customizes/DashboardTable";
import DeleteConfirm from "components/customizes/Form/DeleteConfirm";
import {
  DELETE_CONFIRM_CONTENT,
  DELETE_CONFIRM_TITLE,
  DELETE_SUCCESS,
  DELETE_TYPE,
  EDIT_TYPE,
  ERROR_TYPE,
  SETTING_TYPE,
  SUCCESS_TYPE,
  VIEW_TYPE,
} from "constants/app";
import { Modal } from "@mui/material";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { ApiResponse } from "../../../types/apiResponse";
import { useAuthenController } from "../../../context/authenContext";

type Props = {
  tableTitle: string;
  tableData: (
    handleView: (item: any) => void,
    handleEdit: (item: any) => void,
    handleDelete: (item: any) => void,
    handleSetting: (item: any) => void
  ) => {
    columns: any;
    rows: any;
    fetchData?: ({
      page,
      size,
      search,
    }: {
      page: number;
      size: number;
      search: string;
    }) => Promise<void>;
    pageCount?: number;
    itemCount?: number;
  };

  AddForm?: ({ handleClose }: { handleClose: Function }) => React.ReactElement;
  EditForm?: ({ handleClose, item }: { handleClose: Function; item: any }) => React.ReactElement;
  ViewForm?: ({ handleClose, item }: { handleClose: Function; item: any }) => React.ReactElement;
  SettingForm?: ({ handleClose, item }: { handleClose: Function; item: any }) => React.ReactElement;
  ImportForm?: () => React.ReactElement;
  ExportForm?: () => React.ReactElement;
  ExpandForm?: () => React.ReactElement;
  FilterForm?: () => React.ReactElement;

  deleteAction?: {
    actionDelete: (id: number) => {};
    deleteApi: ({ token, id }: { token: string; id: number }) => Promise<ApiResponse>;
  };

  optionFeature: {
    enableCreate: boolean;
    enableImport: boolean;
    enableExport: boolean;
    enableExpand?: boolean;
    enableSearch?: boolean;
  };
  isCustomTable?: boolean;
};

function BasePage({
  tableTitle,
  tableData,
  AddForm = () => <div />,
  EditForm = () => <div />,
  ViewForm = () => <div />,
  SettingForm = () => <div />,
  ImportForm = () => <div />,
  ExportForm = () => <div />,
  ExpandForm = () => <div />,
  FilterForm = () => <div />,
  deleteAction,
  optionFeature,
  isCustomTable = false,
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  const [itemChoosed, setItemChoosed] = useState<any>(null);
  const [actionType, setActionType] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (item: any) => {
    setOpen(true);
    setItemChoosed(item);
    setActionType(EDIT_TYPE);
  };

  const handleDelete = (item: any) => {
    setOpen(true);
    setItemChoosed(item);
    setActionType(DELETE_TYPE);
  };

  const handleView = (item: any) => {
    setOpen(true);
    setItemChoosed(item);
    setActionType(VIEW_TYPE);
  };

  const handleSetting = (item: any) => {
    setOpen(true);
    setItemChoosed(item);
    setActionType(SETTING_TYPE);
  };

  const confirmDelete = async () => {
    if (itemChoosed && deleteAction !== undefined) {
      const deleteResponse = await deleteAction.deleteApi({
        token: authController.token,
        id: itemChoosed.id,
      });
      if (deleteResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: DELETE_SUCCESS,
        });
        handleClose();
        deleteAction.actionDelete(itemChoosed.id);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: deleteResponse.messageError,
        });
      }
    }
  };

  const formCreate = (closeFormCreate: Function) => <AddForm handleClose={closeFormCreate} />;
  const formEdit = (closeFormEdit: Function) => {
    if (itemChoosed !== null) {
      return <EditForm handleClose={closeFormEdit} item={itemChoosed} />;
    }
    return <div />;
  };

  const formDeleteConfirm = (closeDeleteConfirm: Function) => (
    <DeleteConfirm
      title={DELETE_CONFIRM_TITLE}
      handleConfirmDelete={confirmDelete}
      handleClose={closeDeleteConfirm}
    >
      <p>{DELETE_CONFIRM_CONTENT}</p>
    </DeleteConfirm>
  );

  const formView = (closeView: Function) => {
    if (itemChoosed !== null) {
      return <ViewForm handleClose={closeView} item={itemChoosed} />;
    }
    return <div />;
  };

  const formSetting = (closeSetting: Function) => {
    if (itemChoosed !== null) {
      return <SettingForm handleClose={closeSetting} item={itemChoosed} />;
    }
    return <div />;
  };

  const showModalContent = () => {
    if (actionType === EDIT_TYPE) return formEdit(handleClose);
    if (actionType === DELETE_TYPE) return formDeleteConfirm(handleClose);
    if (actionType === VIEW_TYPE) return formView(handleClose);
    if (actionType === SETTING_TYPE) return formSetting(handleClose);
    return <div />;
  };

  const { columns, rows, fetchData, pageCount, itemCount } = tableData(
    handleView,
    handleEdit,
    handleDelete,
    handleSetting
  );
  return (
    <div key={tableTitle}>
      <DashboardTable
        tableTitle={tableTitle}
        columns={columns}
        rows={rows}
        formCreate={formCreate}
        formImport={ImportForm}
        formExport={ExportForm}
        formExpand={ExpandForm}
        enableCreate={optionFeature.enableCreate}
        enableImport={optionFeature.enableImport}
        enableExport={optionFeature.enableExport}
        enableExpand={optionFeature.enableExpand}
        enableSearch={optionFeature.enableSearch}
        isCustomTable={isCustomTable}
        fetchData={fetchData}
        pageCount={pageCount}
        itemCount={itemCount}
        formFilter={FilterForm}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{showModalContent()}</>
      </Modal>
    </div>
  );
}

export default BasePage;
