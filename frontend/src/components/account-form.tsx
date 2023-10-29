import "../../styles/form.css"

type Field = {
    name: string,
    type: string,
    ref: React.RefObject<HTMLInputElement>
}

type Props = {
    title: string,
    onSubmit: () => void,
    fields: Array<Field>,
    error: string | undefined
}

function AccountForm(props: Props) {
    return (
        <div className="form-container">
            <h1 className="form-title">{props.title}</h1>
            <form className="form">
                {props.fields.map((field: Field, i: number) => (
                    <div className="form-field" key={i}>
                        <h2 className="form-field-name">{field.name}</h2>
                        <input type={field.name} ref={field.ref}/>
                    </div>
                ))}
            </form>
            {props.error && <div className="error-box">{props.error}</div>}
            <button className="submit-button" onClick={() => props.onSubmit()}>Submit</button>
        </div>
    )
}

export default AccountForm