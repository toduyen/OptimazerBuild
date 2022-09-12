import axios from "axios";
import { axiosConfig } from "../../../../configs/api";

const getReport = async (token: string, url: string): Promise<any> =>
  axios
    .get(url, {
      headers: axiosConfig(token).headers,
      responseType: "blob", // important
    })
    .then((response) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", "area_restriction.xlsx");
      document.body.appendChild(link);
      link.click();
    });

export { getReport };
