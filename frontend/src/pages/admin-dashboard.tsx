import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"
import { makeField, Form } from "../components/form"
import ItemsList from "../components/item-list"
import "../../styles/dashboard.css"
import Popup from "reactjs-popup"

type dashboardButtonProps = {
    id: number,
    name: string,
    setter: Function,
    selected: number
}

function DashboardButton(props: dashboardButtonProps) {
    return (
        <button
        onClick={() => props.setter(props.id)}
        className={props.id === props.selected ? "dashboard-nav-button-active" : "dashboard-nav-button"}
        >{props.name}</button>
    )
}

type doctor = {
    name: string,
    specialization: string,
    available: boolean,
    id: number
}

const doctoFields = [
    makeField('Name', 'text', 'name'),
    makeField('Specialization', 'text', 'specialization')
]

function DoctorList(props: {doctors: Array<doctor>}) {
    const data = props.doctors.map((doctor, _) => (
        [doctor.name, doctor.specialization]
    ))

    const navigate = useNavigate()

    return (
        <div className="doctors-list">
            <Popup
            trigger={<button className="add-doctors-button">Add Doctor</button>}
            >
                <Form
                title="New doctor info"
                fields={doctoFields}
                url={"/doctor"}
                extraData={{}}
                errorMsg="Error creating hospital"
                afterSubmit={() => navigate(0)}
                />
            </Popup>
            {data.length === 0 ?
            <h2 className="doctors-hint">Doctors you add will appear here</h2>
            :
            <ItemsList
            features={["Name", "Specialization"]}
            dataItems={data}>
                <button>Make available</button>
            </ItemsList>
            }
        </div>
    )
}

type dashboardData = {
    hospital: {
        address: string,
        close_time: string,
        id: number,
        name: string,
        open_time: string,
        phone: number
    },
    doctors: Array<doctor>
}

type dashboardProps = {
    data: dashboardData
}

function MainDashboard({data}: dashboardProps) {
    const [selected, setSelected] = useState<number>(0)
    const buttonNames = ["Manage doctors", "Appointments"]

    const mainContents = [
        <DoctorList doctors={data.doctors}/>
    ]
    return (
        <div className="main-dashboard">
            <div className="dashboard-nav">
                <h1 className="hospital-title">{data.hospital.name}</h1>
                <div className="dashboard-nav-buttons">
                    {buttonNames.map((name, idx) => (
                        <DashboardButton
                        id={idx} name={name}
                        setter={setSelected} selected={selected}/>
                    ))}
                </div>
            </div>
            {mainContents[selected]}
        </div>
    )
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
    const [loading, setLoading] = useState<boolean>(true)
    const getAdminDetails = () => {
        client.get("/dashboard", {withCredentials: true}).then(response => {
            console.log(response.data)
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
            <h1 className="header-title">Admin Dashboard</h1>
            <div className="dashboard-container">
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