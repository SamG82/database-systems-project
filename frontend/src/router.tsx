import Home from "./pages/home.tsx"
import { makeField, commonFields, Form } from "./components/form.tsx"
import AdminLogin from "./pages/admin-login.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./pages/admin-dashboard.tsx"
import PatientPortal from "./pages/patient-portal.tsx"


const patientRegisterFields = [
  makeField('Name', 'text', 'name'),
  makeField('Address', 'text', 'address'),
  makeField('Phone', 'text', 'phone'),
  ...commonFields.login
]
const adminFields = patientRegisterFields.filter((field) => field.displayName != "Phone")

const patientLoginForm = 
  <Form
  title="Login"
  fields={commonFields.login}
  url="/users/login"
  redirect="/portal"
  extraData={{"role": "patient"}}
  errorMsg="Invalid username or password"
  />


const patientRegisterForm = 
  <Form
  title="Register"
  fields={patientRegisterFields}
  url="/users/register"
  redirect="/login"
  extraData={{"role": "patient"}}
  errorMsg="An account already exists with that email"
  />

const adminRegisterForm = 
  <Form
  title="Admin Register"
  fields={adminFields}
  url="/users/register"
  redirect="/admin-login"
  extraData={{"role": "admin"}}
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
    path: "/portal",
    element: <PatientPortal/>
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