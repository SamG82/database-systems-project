import '../../styles/form.css'
import { useState } from 'react'

type FormField = {
    name: string,
    type: string
}

type Props = {
    title: string,
    fields: Array<FormField>,
    //onSubmit: Function 
}

export const fields = {
    loginFields: [
        {name: "Email", type: "text"},
        {name: "Password", type: "password"}
    ],
    patientRegisterFields: [
        {name: "Name", type: "text"},
        {name: "Address", type: "text"},
        {name: "Phone", type: "text"},
        {name: "Email", type: "text"},
        {name: "Password", type: "password"}
    ],
    adminRegisterFields: [
        {name: "Name", type: "text"},
        {name: "Address", type: "text"},
        {name: "Email", type: "text"},
        {name: "Password", type: "password"}
    ]
}

export function Form(props: Props) {
    const [formData, setFormData] = useState<{[key: string]: string}>({})
    
    const setFormField = (key: string, value: string) => {
        const formCopy: {[key: string]: string} = {...formData}
        formCopy[key.toLowerCase()] = value
        setFormData(formCopy)
    }

    return (
        <div className="form-container">
            <h1 className="form-title">{props.title}</h1>
            <form className="form">
            {props.fields.map((field: FormField, idx: number) => (
                <div className="form-field" key={idx}>
                    <h2 className="form-field-name">{field.name}</h2>
                    <input type={field.type} value={formData[field.name]} onChange={e => setFormField(field.name, e.target.value)}/>
                </div>
            ))}
            </form>
            <button className="submit-button" onClick={_ => console.log(formData)}>Submit</button>
        </div>
        
    )
}