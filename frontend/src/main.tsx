import React from 'react'
import ReactDOM from 'react-dom/client'

import Home from './pages/home.tsx'
import Form from './components/form.tsx'
import Appointments from './pages/appointments.tsx'

import "../styles/index.css"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { registerFields, loginFields } from './form-fields.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Form title="Login" fields={loginFields}/>
  },
  {
    path: "/register",
    element: <Form title="Register" fields={registerFields}/>
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
