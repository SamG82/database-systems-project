import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TimePicker from "react-time-picker"
import client from "../client"

import "react-time-picker/dist/TimePicker.css"

import "../../styles/form.css"

type Field = {
    displayName: string,
    type: string,
    httpValue: string
}

type Props = {
    title: string,
    fields: Array<Field>,
    url: string,
    redirect?: string,
    extraData: {[key: string]: string},
    errorMsg: string,
    afterSubmit?: Function
}

export const commonFields = {
    login: [
        makeField('Email', 'text', 'email'),
        makeField('Password', 'password', 'password')
    ]
}
export function makeField(displayName: string, type: string, httpValue: string): Field {
    return {
        displayName,
        type,
        httpValue
    }
}

export function Form(props: Props) {
    const [error, setError] = useState<string>()
    const navigate = useNavigate()
    const [formFields, setFormFields] = useState<{[key: string]: string}>({})

    const submit = (e: React.MouseEvent) => {
        e.preventDefault()
        client.post(props.url, {...formFields, ...props.extraData}).then(() => {
            if (props.redirect) { navigate(props.redirect)}
        }).catch(() => setError(props.errorMsg))
        if (props.afterSubmit) { props.afterSubmit() } 
    }

    const updateFormField = (fieldName: string, value: string | null) => {
        const copy = {...formFields}
        copy[fieldName] = value === null ? '' : value
        setFormFields(copy)
    }

    return (
        <div className="form-container column-flex main-theme">
            <h1 className="form-title">{props.title}</h1>
            <form className="column-flex">
            {props.fields.map((field: Field, i: number) => {
                if (field.type === "time") {
                    return (
                        <div className="form-field" key={i}>
                            <h2 className="form-field-name">{field.displayName}</h2>
                            <TimePicker
                            format={"h:mm a"}
                            disableClock={true}
                            value={formFields[field.httpValue]}
                            onChange={v => updateFormField(field.httpValue, v)}/>
                        </div>
                    )
                }
                return (
                    <div className="form-field" key={i}>
                        <h2 className="form-field-name">{field.displayName}</h2>
                        <input className="form-field-input"
                        type={field.type}
                        onChange={e => updateFormField(field.httpValue, e.target.value)}
                        value={formFields[field.httpValue]}/>
                    </div>
                )
            })}
            </form>
            {error && <div className="error-box">{error}</div>}
            <button className="submit-button" onClick={e => submit(e)}>Submit</button>
        </div>
    )
}