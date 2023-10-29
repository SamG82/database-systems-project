import Home from "./pages/home.tsx"
import Appointments from "./pages/appointments.tsx"
import AccountForm from "./components/account-form.tsx"
import AdminLogin from "./pages/admin-login.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./pages/admin-dashboard.tsx"


const loginFields = [
  {name: 'Email', type: 'text'},
  {name: 'Password', type: 'password'}
]
const patientRegisterFields = [
  {name: 'Name', type: 'text'},
  {name: 'Address', type: 'text'},
  {name: 'Phone', type: 'text'},
  ...loginFields
]
const adminFields = patientRegisterFields.filter((field) => field.name != "Phone")

const patientLoginForm = 
  <AccountForm
  title="Login"
  fields={loginFields}
  url="/users/login"
  redirect="/appointments"
  role="patient"
  errorMsg="Invalid username or password"
  />


const patientRegisterForm = 
  <AccountForm
  title="Register"
  fields={patientRegisterFields}
  url="/users/register"
  redirect="/login"
  role="patient"
  errorMsg="An account already exists with that email"
  />

const adminRegisterForm = 
  <AccountForm
  title="Admin Register"
  fields={adminFields}
  url="/users/register"
  redirect="/admin-login"
  role="admin"
  errorMsg="An account already exists with that email"
  />
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: patientLoginForm
  },
  {
    path: "/register",
    element: patientRegisterForm
  },
  {
    path: "/appointments",
    element: <Appointments/>
  },
  {
    path: "/admin-login",
    element: <AdminLogin/>
  },
  {
    path: "/admin-register",
    element: adminRegisterForm
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