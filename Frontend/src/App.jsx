import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import HODDashboard from "./pages/HOD/HODDashboard";
import MainLayout from "./components/MainLayout";
import HODRequest from "./pages/HOD/HODRequest";
import HODManageAssets from "./pages/HOD/HODManageAssets";


  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {
          path: "/principal/dashboard",
          element: <PrincipalDashboard/>
        },
        {
          path:"/principal/college-assets",
          element: <h1>College Assets Page</h1>
        },
        {
          path:"/principal/departments",
          element: <h1>Departments Page</h1>
        },
        {
          path:"/principal/requests",
          element: <h1>Requests Page</h1>
        },
        {
          path:"/principal/reports",
          element: <h1>Reports Page</h1>
        },
      ]
    },
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {
          path:"/hod/dashboard",
          element: <HODDashboard/>
        },
        {
          path:"/hod/manage-assets",
          element: <HODManageAssets/>
        },
        {
          path:"/hod/request",
          element: <HODRequest/>
        },
        {
          path:"/hod/reports",
          element: <h1>Reports Page</h1>
        }
      ]
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/register",
      element: <RegisterPage/>
    }
  ])



export default router;
