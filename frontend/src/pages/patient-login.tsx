import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import AccountForm from "../components/account-form"
import "../../styles/form.css"

const loginURL = "http://localhost:5000/users/login"

function PatientLogin() {
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string>()
    const navigate = useNavigate()

    const submit = () => {
        console.log('test')
        axios.post(loginURL, {
            email: email.current?.value,
            password: password.current?.value,
            role: "patient"
        }).then(() => navigate("/appointments")).catch(() => setError("Invalid username or password"))
    }
    const fields = [
        {name: "Email", type: "text", ref: email},
        {name: "Password", type: "password", ref: password}
    ]
    return (
        <AccountForm title="Login" fields={fields} onSubmit={submit} error={error} />
    )
}

export default PatientLogin