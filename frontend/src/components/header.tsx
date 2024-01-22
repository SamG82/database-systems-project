import { useNavigate } from "react-router-dom"
import client from "../client"
import "../../styles/header.css"
import { PropsWithChildren } from "react"

type Props = {
    title: string
    userRole: "admin" | "patient"
}

function Header(props: PropsWithChildren<Props>) {
    const navigate = useNavigate()

    const logout = () => {
        client.post(`/${props.userRole}/logout`, {}, {withCredentials: true})
            .then(_ => navigate("/"))
    }
    return (
        <div className="header">
            <h1>{props.title}</h1>
            <div className="spacer">
                {props.children}
            </div>
            <button className="logout-button" onClick={_ => logout()}>Logout</button>
        </div>
    )
}

export default Header
