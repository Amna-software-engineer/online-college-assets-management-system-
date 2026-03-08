import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import HODDashboard from "./pages/HOD/HODDashboard";
import MainLayout from "./components/MainLayout";
import HODRequest from "./pages/HOD/HODRequest";
import HODManageAssets from "./pages/HOD/HODManageAssets";
import HODReport from "./pages/HOD/HODReport";
import { ProtectRoute } from "./components/ProtectRoute";
import PrincipalClgAssets from "./pages/principal/PrincipalClgAssets";
import PrincipalDepartments from "./pages/principal/PrincipalDepartments";
import HodInfoPage from "./pages/HOD/HodInfo";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/principal/dashboard",
        element: <ProtectRoute><PrincipalDashboard /></ProtectRoute>
      },
      {
        path: "/principal/college-assets",
        element: <ProtectRoute><PrincipalClgAssets /></ProtectRoute>
      },
      {
        path: "/principal/departments",
        element: <ProtectRoute><PrincipalDepartments /></ProtectRoute>
      },
      {
        path: "/principal/requests",
        element: <ProtectRoute><h1>Requests Page</h1></ProtectRoute>
      },
      {
        path: "/principal/reports",
        element: <ProtectRoute><h1>Reports Page</h1></ProtectRoute>
      },
    ]
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/hod/dashboard",
        element: <ProtectRoute><HODDashboard /></ProtectRoute>
      },
      {
        path: "/hod/manage-assets",
        element: <ProtectRoute><HODManageAssets /></ProtectRoute>
      },
      {
        path: "/hod/request",
        element: <ProtectRoute><HODRequest /></ProtectRoute>
      },
      {
        path: "/hod/reports",
        element: <ProtectRoute><HODReport /></ProtectRoute>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },{
    path: "/hod-info",
    element:<HodInfoPage/>
  }
])



export default router;
