import React from 'react';
import Card from "@mui/material/Card";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import MDInput from "components/bases/MDInput";
import MDButton from "components/bases/MDButton";
import { FormAddOrUpdateType } from "types/formAddOrUpdateType";
import PasswordFieldComponent from "./PasswordFieldComponent";
import { hideLoading, showLoading, useSnackbarController } from "context/snackbarContext";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function FormAddOrUpdate({
  title,
  fields,
  handleAddOrUpdate,
  actionLabel,
  visibleCloseButton,
  handleClose,
  headChildren,
  children,
}: FormAddOrUpdateType) {
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  return (
    <MDBox px={1} width="100%" height="100vh" mx="auto" key={title}>
      <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
          <Card>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              mx={2}
              mt={-3}
              p={2}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white">
                {title}
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3} style={{ maxHeight: "750px", overflowY: "auto" }}>
              <MDBox component="form" role="form">
                {headChildren}
                {fields.map((field, index) => {
                  if (field.type === "autocomplete-multiple") {
                    return (
                        // Key chỗ này đang có vấn đề có 2 thằng trùng nhau ok bác sang t2 sẽ xem qua
                        <MDBox mb={2} key={`${field.label}_${index}`}>
                        <Autocomplete
                          value={field.checked}
                          key={`fields_${field.label}`}
                          onChange={(event, newOptions) => {
                            field.action(newOptions);
                          }}
                          multiple
                          disablePortal
                          disableCloseOnSelect
                          id="tags-filled"
                          options={field.data}
                          renderOption={(props, option, { selected }) => (
                            <li {...props} style={{ marginBottom: "5px" }}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label={field.label} placeholder="Search..." />
                          )}
                          ListboxProps={{ style: { maxHeight: "15rem" } }}
                        />
                      </MDBox>
                    );
                  }
                  if (field.type === "autocomplete") {
                    return (
                      <MDBox mb={2} key={`${field.label}_${index}`}>
                        <Autocomplete
                          value={field.choosedValue}
                          key={`fields_${field.label}`}
                          onChange={(event, newOptions) => {
                            field.action(newOptions);
                          }}
                          disablePortal
                          id="autocomplete"
                          options={field.data}
                          renderInput={(params) => (
                            <TextField {...params} label={field.label} placeholder="Search..." />
                          )}
                          ListboxProps={{ style: { maxHeight: "15rem" } }}
                        />
                      </MDBox>
                    );
                  }
                  if (field.type === "password") {
                    return <PasswordFieldComponent field={field} />;
                  }
                  return (
                    <MDBox mb={2} key={`${field.label}_${index}`}>
                      <MDInput
                        value={field.data}
                        type={field.type}
                        label={field.label}
                        fullWidth
                        onChange={(e: any) => field.action(e.target.value)}
                      />
                    </MDBox>
                  );
                })}
                {children}
                <MDBox mt={4} mb={1} display="flex">
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={() => {
                      showLoading(snackbarDispatch);
                      handleAddOrUpdate();
                      hideLoading(snackbarDispatch);
                    }}
                  >
                    {actionLabel}
                  </MDButton>

                  {visibleCloseButton && (
                    <>
                      <MDBox sx={{ width: "30px" }} />
                      <MDButton variant="gradient" color="error" fullWidth onClick={handleClose}>
                        Hủy bỏ
                      </MDButton>
                    </>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}

FormAddOrUpdate.defaultProps = {
  children: <div />,
  handleClose: () => {},
  visibleCloseButton: true,
};
export default FormAddOrUpdate;
