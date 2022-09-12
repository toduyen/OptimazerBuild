// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "components/customizes/DashboardLayout";
import Footer from "components/customizes/Footer";

import DataTable from "components/customizes/Tables/DataTable";

import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import MDButton from "components/bases/MDButton";
import DataTableEmployee from "../../../layouts/base/employees/components/DataTableEmployee";
import { useAuthenController } from "context/authenContext";
import { isAreaRestrictionUser, isTimeKeepingUser } from "utils/checkRoles";
import { MODULE_AREA_RESTRICTION_TYPE, MODULE_TIME_KEEPING_TYPE } from "constants/app";

type Props = {
  tableTitle: string;
  columns: any;
  rows: any;
  enableCreate?: boolean;
  enableImport?: boolean;
  enableExport?: boolean;
  enableExpand?: boolean;
  enableSearch?: boolean;
  formCreate: (handleClose: Function) => React.ReactElement;
  formImport?: () => React.ReactElement;
  formExport?: () => React.ReactElement;
  formExpand?: () => React.ReactElement;
  isCustomTable?: boolean;
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
  formFilter?: () => React.ReactElement;
};

function DashboardTable({
  tableTitle,
  columns,
  rows,
  enableCreate = false,
  enableImport = false,
  enableExport = false,
  enableExpand = false,
  enableSearch = true,
  formCreate,
  formImport,
  formExpand,
  formExport,
  isCustomTable = false,
  fetchData,
  pageCount,
  itemCount,
  formFilter,
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [moduleType, setModuleType] = useState("");

  // @ts-ignore
  const [authController] = useAuthenController();

  useEffect(() => {
    if (authController.currentUser) {
      if (isTimeKeepingUser(authController.currentUser)) {
        setModuleType(MODULE_TIME_KEEPING_TYPE);
      } else if (isAreaRestrictionUser(authController.currentUser)) {
        setModuleType(MODULE_AREA_RESTRICTION_TYPE);
      }
    }
  }, [authController.token]);
  const [actionType, setActionType] = useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const renderForm = () => {
    switch (actionType) {
      case "create":
        return formCreate(handleClose);
      case "import":
        return <div />;
      case "export":
        return <div />;
      default:
        return <div />;
    }
  };
  return (
      <DashboardLayout>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    justifyContent="space-between"
                    display="flex"
                >
                  <MDTypography variant="h5" color="white">
                    {tableTitle}
                  </MDTypography>

                  <MDBox
                      display="flex"
                      alignItems="center"
                      mt={{ xs: 2, sm: 0 }}
                      ml={{ xs: -1.5, sm: 0 }}
                  >
                    {enableCreate ? (
                        <MDButton
                            variant="text"
                            color="white"
                            onClick={() => {
                              setOpen(true);
                              setActionType("create");
                            }}
                        >
                          <div style={{ display: "flex", alignSelf: "center"}}>
                            <Icon>add_circle_outline</Icon>
                            <span style={{paddingLeft: "0.3em"}}>thêm mới</span>
                          </div>
                        </MDButton>
                    ) : (
                        <div />
                    )}
                    {enableImport && formImport && formImport()}
                    {enableExport && formExport && formExport()}
                    {enableExpand && formExpand && formExpand()}
                  </MDBox>
                </MDBox>
                <MDBox pt={3}>
                  {isCustomTable ? (
                      <DataTableEmployee
                          table={{ columns, rows }}
                          isSorted={false}
                          entriesPerPage
                          showTotalEntries
                          noEndBorder
                          canSearch={enableSearch}
                          showCheckAll={false}
                          fetchData={fetchData}
                          pageCount={pageCount}
                          itemCount={itemCount}
                          formFilter={formFilter}
                      />
                  ) : (
                      <DataTable
                          table={{ columns, rows }}
                          isSorted={false}
                          entriesPerPage
                          showTotalEntries
                          noEndBorder
                          canSearch={enableSearch}
                          showCheckAll={false}
                          fetchData={fetchData}
                          pageCount={pageCount}
                          itemCount={itemCount}
                          formFilter={formFilter}
                      />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <>{renderForm()}</>
        </Modal>
      </DashboardLayout>
  );
}

export default DashboardTable;