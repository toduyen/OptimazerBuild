import { useEffect, useState } from "react";
import { getAllFeaturesApi } from "../api";
import { Feature } from "models/base/feature";
import { isSuperAdmin } from "../../../../utils/checkRoles";
import { useAuthenController } from "../../../../context/authenContext";
import { getAllFeatureSuccess, useFeatureController } from "../../../../context/featureContext";

export default function data() {
  const [featuresDatas, setFeaturesData] = useState([]);

  // @ts-ignore
  const [authController, dispatch] = useAuthenController();
  // @ts-ignore
  const [featureController, featureDispatch] = useFeatureController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      const getAllFeaturesResponse = await getAllFeaturesApi(authController.token);
      if (getAllFeaturesResponse.data !== null) {
        getAllFeatureSuccess(featureDispatch, getAllFeaturesResponse.data);
      }
    }
  }, [authController.token]);

  const convertDataToRow = (feature: Feature) =>
    isSuperAdmin(authController.currentUser)
      ? {
          featuresName: feature.name,
          accountUsed: feature.numberAccount,
          organizationUsed: feature.numberOrganization,
        }
      : { featuresName: feature.name, accountUsed: feature.numberAccount };

  useEffect(() => {
    if (featureController.features) {
      setFeaturesData(
        featureController.features.map((feature: Feature) => convertDataToRow(feature))
      );
    }
  }, [featureController.features]);

  return {
    columns: isSuperAdmin(authController.currentUser)
      ? [
          { Header: "Tên tính năng", accessor: "featuresName", align: "left" },
          { Header: "Số tài khoản sử dụng", accessor: "accountUsed", align: "left" },
          { Header: "Số tổ chức sử dụng", accessor: "organizationUsed", align: "left" },
        ]
      : [
          { Header: "Tên tính năng", accessor: "featuresName", align: "left" },
          { Header: "Số tài khoản sử dụng", accessor: "accountUsed", align: "left" },
        ],

    rows: featuresDatas,
  };
}
