import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context/materialContext";
import { SnackbarProvider } from "./context/snackbarContext";
import reportWebVitals from "./reportWebVitals";
import { TimeKeepingNotificationProvider } from "./context/timeKeepingNotificationContext";
import { AreaRestrictionProvider } from "./context/areaRestrictionContext";
import { AuthenProvider } from "./context/authenContext";
import { CameraProvider } from "./context/cameraContext";
import { EmployeeProvider } from "./context/employeeContext";
import { FeatureProvider } from "./context/featureContext";
import { InOutHistoryProvider } from "./context/inOutHistoryContext";
import { LocationProvider } from "./context/locationContext";
import { NotificationHistoryProvider } from "./context/notificationHistoryContext";
import { OrganizationProvider } from "./context/organizationContext";
import { RoleProvider } from "./context/roleContext";
import { ShiftProvider } from "./context/shiftContext";
import { UserLogProvider } from "./context/userLogContext";
import { UserProvider } from "./context/userContext";

import { combineComponents } from "./components/customizes/CombineComponent";
import { AreaRestrictionNotificationProvider } from "./context/areaRestrictionNotificationContext";
import { GuestProvider } from "context/guestContext";

const providers = [
  MaterialUIControllerProvider,
  AuthenProvider,
  SnackbarProvider,
  TimeKeepingNotificationProvider,
  AreaRestrictionProvider,
  CameraProvider,
  EmployeeProvider,
  FeatureProvider,
  InOutHistoryProvider,
  LocationProvider,
  NotificationHistoryProvider,
  OrganizationProvider,
  RoleProvider,
  ShiftProvider,
  UserProvider,
  UserLogProvider,
  AreaRestrictionNotificationProvider,
  GuestProvider,
];

// @ts-ignore
const AppContextProvider = combineComponents(...providers);

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
