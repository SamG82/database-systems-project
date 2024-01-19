import { useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"

import { TimePicker } from "react-time-picker"
import 'react-time-picker/dist/TimePicker.css'

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
    extraData?: {[key: string]: string},
    afterSubmit?: Function
}

export const commonFields = {
    login: [
        makeField('Email', 'text', 'email'),
        makeField('Password', 'password', 'password')
    ],
    register: [
        makeField('First Name', 'text', 'first_name'),
        makeField('Last Name', 'text', 'last_name'),
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
    const [errors, setErrors] = useState<{[key: string]: string}>()
    const navigate = useNavigate()
    const [formFields, setFormFields] = useState<{[key: string]: string}>({})

    const getErrorMsgs = (): Array<React.ReactNode> => {
        let divs: Array<React.ReactNode> = []
        
        if (errors === undefined) { return []}

        for (const error in errors) {
            divs.push(<div className="error-box">{errors[error]}</div>)
        }
        return divs
    }

    const submit = (e: React.MouseEvent) => {
        e.preventDefault()
        client.post(props.url, {...formFields, ...props.extraData}, {withCredentials: true}).then(() => {
            if (props.redirect) {
                setErrors({})
                navigate(props.redirect)
            }

            if (props.afterSubmit) {
                props.afterSubmit()
            }
            
        }).catch((error) => {
            setErrors(error.response.data.errors)
        })
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
                        value={formFields[field.httpValue]}
                        min={field.type === "number" ? 10 : undefined}
                        max={field.type === "number" ? 60 : undefined}
                        step={field.type === "number" ? 5 : undefined}/>
                    </div>
                )
            })}
            </form>
            {getErrorMsgs()}
            <button className="submit-button" onClick={e => submit(e)}>Submit</button>
        </div>
    )
}