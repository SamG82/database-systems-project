import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../styles/form.css"
import AccountForm from "../components/account-form"

const registerURL = "http://localhost:5000/users/register"

function PatientRegister() {
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const name = useRef<HTMLInputElement>(null)
    const address = useRef<HTMLInputElement>(null)
    const phone = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string>()
    const navigate = useNavigate()

    const submit = () => {
        axios.post(registerURL, {
            email: email.current?.value,
            password: password.current?.value,
            role: "patient"
        }).then(() => navigate("/login")).catch(() => setError("An account already exists with that information"))
    }
    const fields = [
        {name: "Name", type: "text", ref: name},
        {name: "Address", type: "text", ref: address},
        {name: "Phone", type: "text", ref: phone},
        {name: "Email", type: "text", ref: email},
        {name: "Password", type: "password", ref: password},
    ]

    return (
        <AccountForm title="Register" fields={fields} onSubmit={submit} error={error}/>
    )
}

export default PatientRegister