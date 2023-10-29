import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"

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
            {dashboard?.hospital && <h1>You have not yet added a hospital</h1>}
            <h1>{dashboard?.hospital.name}</h1>
        </div>
    )
}

export default AdminDashboard