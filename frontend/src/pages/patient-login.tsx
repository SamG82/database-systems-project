import { Form, commonFields } from "../components/form"

export default function PatientLogin() {
    return (
        <Form
        title="Login"
        fields={commonFields.login}
        url="/patient/login"
        redirect="/portal"
    />
    )
}