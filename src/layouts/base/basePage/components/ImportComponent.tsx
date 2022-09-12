import MDButton from "../../../../components/bases/MDButton";
import Icon from "@mui/material/Icon";
import MDBox from "../../../../components/bases/MDBox";
import React from "react";
import { Tooltip } from "@mui/material";
import MDTypography from "../../../../components/bases/MDTypography";

export default function ImportComponent({
        title,
        handleImport,
    }: {
    title: string;
    handleImport: (files: any) => void;
}) {
    function TooltipTitle() {
        return (
            <MDBox style={{ color: "white" }}>
                <p>Tải lên thư mục gồm:</p>
                <p>- 1 file excel danh sách nhân sự (theo mẫu).</p>
                <p>- Các file ảnh nhân viên (đặt tên file ảnh là mã nhân viên)</p>
            </MDBox>
        );
    }
    return (
        <MDBox mr={1}>
            <Tooltip title={<TooltipTitle />}>
                <MDButton variant="text" color="white">
                    <label htmlFor="import-image" style={{ cursor: "pointer" }}>
                        <input
                            style={{ display: "none" }}
                            type="file"
                            id="import-image"
                            // @ts-ignore
                            webkitdirectory=""
                            mozdirectory=""
                            directory=""
                            onChange={(e) => {
                                handleImport(e.target.files);
                                e.target.value = "";
                            }}
                        />
                        <div style={{ display: "flex", alignSelf: "center"}}>
                            <Icon>upload_file</Icon>
                            <span style={{paddingLeft: "0.3em"}}>{title}</span>
                        </div>
                    </label>
                </MDButton>
            </Tooltip>
        </MDBox>
    );
}