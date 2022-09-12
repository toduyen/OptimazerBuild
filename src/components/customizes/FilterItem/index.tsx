import MDBox from "../../bases/MDBox";

import MDAlertCloseIcon from "components/bases/MDAlert/MDAlertCloseIcon";

export default function FilterItem({
  value,
  handleClose,
}: {
  value: string;
  handleClose: () => void;
}) {
  return (
    <MDBox
      borderRadius={20}
      px={1}
      my={1}
      style={{
        backgroundColor: "#4F4F52",
        color: "white",
        fontSize: "0.875rem",
        padding: "10px",
      }}
    >
      {value}
      <MDAlertCloseIcon onClick={handleClose} style={{ marginLeft: "10px" }}>
        &times;
      </MDAlertCloseIcon>
    </MDBox>
  );
}
