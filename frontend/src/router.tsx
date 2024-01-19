import Home from "./pages/home.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import PatientPortal from "./pages/patient-portal.tsx"
import PatientLogin from "./pages/patient-login.tsx"
import PatientRegister from "./pages/patient-register.tsx"


import AdminDashboard from "./pages/admin-dashboard.tsx"
import AdminLogin from "./pages/admin-login.tsx"
import AdminRegister from "./pages/admin-register.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <PatientLogin/>
  },
  {
    path: "/register",
    element: <PatientRegister/>
  },
  {
    path: "/portal",
    element: <PatientPortal/>
  },
  {
    path: "/admin-login",
    element: <AdminLogin/>
  },
  {
    path: "/admin-register",
    element: <AdminRegister/>
  },
  {
    path: "/dashboard",
    element: <AdminDashboard/>
  }
])

function Router() {
    return (
        <RouterProvider router={router}/>
    )
}

export default Router