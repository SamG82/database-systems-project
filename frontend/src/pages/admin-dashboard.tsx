import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"
import { makeField, Form } from "../components/form"
import "../../styles/dashboard.css"

type dashboardData = {
    hospital: {
        address: string,
        close_time: string,
        id: number,
        name: string,
        open_time: string,
        phone: number
    }
}

const hospitalRegisterFields = [
    makeField('Hospital Name', 'text', 'name'),
    makeField('Address', 'text', 'address'),
    makeField('Phone Contact', 'text', 'phone'),
    makeField('Opening time', 'text', 'open_time'),
    makeField('Closing time', 'text', 'close_time')
]

function AdminDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState<dashboardData>()

    const getAdminDetails = () => {
        client.get("/dashboard", {withCredentials: true}).then(response => {
            setDashboard(response.data)
        }).catch(_ => navigate("/admin-login"))
    }

    useEffect(() => {
        getAdminDetails()
    }, [])

    return (
        <div className="admin-dashboard">
            <h1 className="header-title">Dashboard</h1>
            <div className="main-dashboard column-flex">
            {dashboard?.hospital &&
            <Form
            title="Register hospital info"
            fields={hospitalRegisterFields}
            url={"/hospital"}
            redirect={null}
            extraData={{}}
            errorMsg="Error creating hospital"
            />
            }   
            </div>
        </div>
    )
}

export default AdminDashboard