import { Form, commonFields } from "../components/form"

export default function AdminRegister() {
    return (
        <Form
        title="Admin Register"
        fields={commonFields.register}
        url="/admin/create"
        redirect="/admin-login"
    />
    )
}