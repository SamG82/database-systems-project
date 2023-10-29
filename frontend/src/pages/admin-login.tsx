import AccountForm from "../components/account-form"
import { Link } from "react-router-dom"

function AdminLogin() {
    const adminLoginFields = [
        {name: "Email", type: "text"},
        {name: "Password", type: "password"}
    ]

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
            <AccountForm
            title="Admin Login"
            fields={adminLoginFields}
            url="/users/login"
            redirect="/dashboard"
            role="admin"
            errorMsg="Invalid username or password"
            />
            <Link style={linkStyle} to="/admin-register">Don't have an administrator account?</Link>
        </div>
    )
}

export default AdminLogin