import { commonFields, Form } from "../components/form"
import { Link } from "react-router-dom"

function AdminLogin() {

    // using js styles because it's very minimal
    const style: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }

    const linkStyle: React.CSSProperties = {
        textDecoration: "none",
        fontSize: "1.5rem",
        color: "white"
    }
    return (
        <div className="admin-login" style={style}>
            <Form
            title="Admin Login"
            fields={commonFields.login}
            url="/users/login"
            redirect="/dashboard"
            extraData={{"role": "admin"}}
            errorMsg="Invalid username or password"
            />
            <Link style={linkStyle} to="/admin-register">Don't have an administrator account?</Link>
        </div>
    )
}

export default AdminLogin