import { useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"

import "../../styles/form.css"

type Field = {
    name: string,
    type: string
}

type Props = {
    title: string,
    fields: Array<Field>,
    url: string,
    redirect: string,
    role: string,
    errorMsg: string
}

function AccountForm(props: Props) {
    const [error, setError] = useState<string>()
    const navigate = useNavigate()
    const [formFields, setFormFields] = useState<{[key: string]: string}>({})

    const submit = (e: React.MouseEvent) => {
        e.preventDefault()
        client.post(props.url, {...formFields, role: props.role}).then(() => navigate(props.redirect)).catch(() => setError(props.errorMsg))
    }

    const updateFormField = (fieldName: string, value: string) => {
        const copy = {...formFields}
        copy[fieldName] = value
        setFormFields(copy)
    }
    return (
        <div className="form-container column-flex main-theme">
            <h1 className="form-title">{props.title}</h1>
            <form className="column-flex">
                {props.fields.map((field: Field, i: number) => (
                    <div className="form-field" key={i}>
                        <h2 className="form-field-name">{field.name}</h2>
                        <input
                        type={field.name}
                        onChange={e => updateFormField(field.name.toLowerCase(), e.target.value)}
                        value={formFields[field.name.toLowerCase()]}/>
                    </div>
                ))}
            </form>
            {error && <div className="error-box">{error}</div>}
            <button className="submit-button" onClick={e => submit(e)}>Submit</button>
        </div>
    )
}

export default AccountForm