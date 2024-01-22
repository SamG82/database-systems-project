import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"
import { makeField, Form } from "../components/form"
import ItemsList from "../components/item-list"
import { formatTime } from "../utils"
import "../../styles/dashboard.css"
import Popup from "reactjs-popup"
import { PieChart } from "react-minimal-pie-chart"
import Header from "../components/header"

import { Doctor } from "../interfaces/doctor"
import { AdminsAppointment } from "../interfaces/appointment"
import { AdminHospital } from "../interfaces/hospital"

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

const doctorFields = [
    makeField('First name', 'text', 'first_name'),
    makeField('Last name', 'text', 'last_name'),
    makeField('Specialization', 'text', 'specialization')
]

function DoctorList() {
    const [doctors, setDoctors] = useState<Array<Doctor>>()
    const [loading, setLoading] = useState<boolean>(true)
    const [showDoctorForm, setShowDoctorForm] = useState<boolean>(false)

    const getDoctors = () => {
        client.get('/doctor/', {withCredentials: true}).then(response => {
            setDoctors(response.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        getDoctors()
    }, [])

    const removeDoctor = (id: number) => {
        client.delete(`/doctor/delete/${id}`,{withCredentials: true}).then(_ => getDoctors())
    }
    const changeAvailabiltiy = (id: number) => {
        client.patch(`/doctor/update-availability/${id}`, undefined, {withCredentials: true}).then(_ => getDoctors())
    }
    
    if (loading) return null
    const data = doctors?.map((doctor, _) => (
        [
            `${doctor.first_name} ${doctor.last_name}`,
            doctor.specialization,
            doctor.availability ?
            <button onClick={_ => changeAvailabiltiy(doctor.id)} className="doctor-button available">Available</button>
            : <button onClick={_ => changeAvailabiltiy(doctor.id)} className="doctor-button unavailable">Unavailable</button>
            ,
            <button onClick={_ => removeDoctor(doctor.id)} className="remove-doctor doctor-button">Delete</button>

        ]
    ))

    return (
        <div className="doctors-list">
            <button onClick={_ => setShowDoctorForm(true)} className="add-doctors-button">Add Doctor</button>
            <Popup
            onClose={_ => setShowDoctorForm(false)}
            open={showDoctorForm}
            >
                <Form
                title="New doctor info"
                fields={doctorFields}
                url={"/doctor/create"}
                afterSubmit={() => {
                    setShowDoctorForm(false)
                    getDoctors()
                }}
                />
            </Popup>
            {data === undefined || data.length === 0 ?
            <h2 className="doctors-hint">Doctors you add will appear here</h2>
            :
            <ItemsList
            features={["Name", "Specialization", "Toggle Availability", ""]}
            dataItems={data}/>
            }
        </div>
    )
}

function AppointmentCard({appt}: {appt: AdminsAppointment}) {
    return (
        <div className="appointment-card">
            <div>
                <h2>Review Sentiment</h2>
                <SentimentChart sentiment={appt.sentiment}/>
            </div>
            <div>
                <h2>Patient concerns</h2>
                <p>{appt.patient_concerns}</p>
            </div>
            <div>
                <h2>Patient satisfaction - {appt.patient_satisfaction}/5</h2>
            </div>
            <div>
                <h2>Review</h2>
                <p>{appt.patient_review}</p>
            </div>
            <div>
                <h2>Time</h2>
                <p>{`${formatTime(appt.start_time)} - ${formatTime(appt.end_time)}`}</p>
            </div>
        </div>
    )
}

type sentiment = {
    pos: number,
    neu: number,
    neg: number
}

function SentimentChart({sentiment}: {sentiment: sentiment | undefined}) {
    if (sentiment === undefined) return null
    const data = [
        {title: 'Positive', value: sentiment?.pos, color: '#04AA6D'},
        {title: 'Negative', value: sentiment?.neg, color: '#c92a35'},
        {title: 'Neutral', value: sentiment?.neu, color: '#bfbfbf'}
    ]

    const formatScore = (score: number | undefined): string => {
        if (score === undefined) return ""

        return `${(Math.round(score * 100)).toFixed(2)}%`
    }

    return (
        <div className="sentiment-chart">
            <PieChart
            animate={true}
            data={data}/>
            <div className="legend">
                <span className="pos">Positive - {formatScore(sentiment?.pos)}</span>
                <span className="neu">Neutral - {formatScore(sentiment?.neu)}</span>
                <span className="neg">Negative - {formatScore(sentiment?.neg)}</span>
            </div>
        </div>
    )
}

type AppointmentData = {
    appointments: Array<AdminsAppointment>,
    combined: sentiment
}

function AppointmentList() {
    const [appointmentData, setAppointmentData] = useState<AppointmentData>()
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        client.get('/appointment/admin', {withCredentials: true}).then(response => {
            setAppointmentData(response.data)
            setLoading(false)
        })
    }, [])
    const apptData = appointmentData?.appointments.map((appt, _) => (
        [
            appt.doctor_name,
            appt.patient_name,
            appt.date,
            appt.sentiment ? 
            <Popup trigger={<button className="add-doctors-button appt-details">View Details</button>} position={"left center"}>
                <AppointmentCard appt={appt}/>
            </Popup> : <button className="unreviewed">Unreviewed</button>
        ]
    ))

    if (loading) return null
    return (
        <div className="appointment-list">
            {appointmentData?.appointments.length === 0 ?
            <h1 className="no-appointments">No appointments have been made yet</h1>
            :
            <>
            <div className="overall-score">
                <h1>Average Review Score </h1>
                <SentimentChart sentiment={appointmentData?.combined}/>
            </div>
            <ItemsList dataItems={apptData === undefined ? [] : apptData} features={["Doctor", "Patient", "Date", ""]}/>
            </>
            }
        </div>
    )
}

function MainDashboard(props: { hospitalName: string}) {
    const [selected, setSelected] = useState<number>(0)
    const buttonNames = ["Manage doctors", "Appointments"]

    const mainContents = [
        <DoctorList/>,
        <AppointmentList/>
    ]
    return (
        <div className="main-dashboard">
            <div className="dashboard-nav">
                <h1 className="hospital-title">{props.hospitalName}</h1>
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
    makeField('Phone Contact', 'phone', 'phone'),
    makeField('Opening time', 'time', 'open_time'),
    makeField('Closing time', 'time', 'close_time'),
    makeField('Appointment Length (minutes)', 'number', 'appointment_length')
]

function AdminDashboard() {
    const navigate = useNavigate()
    const [hospital, setHospital] = useState<AdminHospital>()

    const [loading, setLoading] = useState<boolean>(true)

    const getAdminDetails = () => {
        client.get("/hospital/admin", {withCredentials: true}).then(response => {
            setHospital(response.data)
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
            <Header userRole="admin" title="Admin Dashboard"></Header>
            <div className="dashboard-container">
            {hospital && hospital.name  ?
            <MainDashboard hospitalName={hospital.name}/> : 
            <Form
            title="Register hospital info"
            fields={hospitalRegisterFields}
            url={"/hospital/create"}
            afterSubmit={() => navigate(0)}
            />
            }
            </div>
        </div>
    )
}

export default AdminDashboard