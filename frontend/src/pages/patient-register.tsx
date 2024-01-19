import { Form, commonFields } from "../components/form"

export default function PatientRegister() {
    return (
        <Form
        title="Register"
        fields={commonFields.register}
        url="/patient/create"
        redirect="/login"
    />
    )
}