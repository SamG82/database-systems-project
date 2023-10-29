import Home from "./pages/home.tsx"
import Appointments from "./pages/appointments.tsx"
import AccountForm from "./components/account-form.tsx"
import AdminLogin from "./pages/admin-login.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"


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
  url="http://localhost:5000/users/login"
  redirect="/appointments"
  role="patient"
  errorMsg="Invalid username or password"
  />


const patientRegisterForm = 
  <AccountForm
  title="Register"
  fields={patientRegisterFields}
  url="http://localhost:5000/users/register"
  redirect="/login"
  role="patient"
  errorMsg="An account already exists with that email"
  />

const adminRegisterForm = 
  <AccountForm
  title="Admin Register"
  fields={adminFields}
  url="http://localhost:5000/users/register"
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
  }
])

function Router() {
    return (
        <RouterProvider router={router}/>
    )
}

export default Router