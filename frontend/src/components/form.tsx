import "../../styles/form.css"

type FormField = {
    name: string,
    type: string
}

type Props = {
    title: string,
    fields: Array<FormField>
}

function Form(props: Props) {
    return (
        <div className="form-container">
            <h1 className="form-title">{props.title}</h1>
            <form className="form">
            {props.fields.map((field: FormField, idx: number) => (
                <div className="form-field" key={idx}>
                    <h2 className="form-field-name">{field.name}</h2>
                    <input type={field.type}/>
                </div>
            ))}
            </form>
            <button className="submit-button">Submit</button>
        </div>
        
    )
}

export default Form