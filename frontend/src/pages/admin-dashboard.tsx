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

type dashboardProps = {
    data: dashboardData | undefined
}

function MainDashboard({data}: dashboardProps) {
    return (
        <div className="main-dashboard">
            <h1>{data?.hospital.name}</h1>
        </div>
    )
}

function AdminDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState<dashboardData>()
    const [loading, setLoading] = useState<boolean>(true)
    const getAdminDetails = () => {
        client.get("/dashboard", {withCredentials: true}).then(response => {
            setDashboard(response.data)
            setLoading(false)
        }).catch(_ => navigate("/admin-login"))
    }

    // get dashboard details whenever loaded
    useEffect(() => {
        getAdminDetails()
    }, [])

    if (loading) return null
    return (
        <div className="admin-dashboard">
            <h1 className="header-title">Dashboard</h1>
            <div className="main-dashboard column-flex">
            {dashboard && dashboard.hospital.name ?
            <MainDashboard data={dashboard}/> : 
            <Form
            title="Register hospital info"
            fields={hospitalRegisterFields}
            url={"/hospital"}
            extraData={{}}
            errorMsg="Error creating hospital"
            afterSubmit={() => navigate(0)}
            />
            }
            </div>
        </div>
    )
}

export default AdminDashboard