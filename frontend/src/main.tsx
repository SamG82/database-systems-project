import React from "react"
import ReactDOM from "react-dom/client"

import Home from "./pages/home.tsx"
import Appointments from "./pages/appointments.tsx"
import PatientLogin from "./pages/patient-login.tsx"
import PatientRegister from "./pages/patient-register.tsx"

import "../styles/index.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

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
    path: "/appointments",
    element: <Appointments/>
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main>
      <RouterProvider router={router}/>
    </main>
  </React.StrictMode>,
)
