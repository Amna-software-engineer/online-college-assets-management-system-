import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <h1>Home</h1>
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
