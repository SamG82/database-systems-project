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
    const removeDoctor = (id: number) => {
        client.delete(`/doctor/${id}`,{withCredentials: true}).then(() => navigate(0))
    }

    const changeAvailabiltiy = (id: number, change: boolean) => {
        client.patch(`/doctor/${id}`, {"availability": change}, {withCredentials: true}).then(() => navigate(0))
    }

    const data = props.doctors.map((doctor, _) => (
        [
            doctor.name,
            doctor.specialization,
            doctor.available ?
            <button onClick={_ => changeAvailabiltiy(doctor.id, false)} className="doctor-button available">Available</button>
            : <button onClick={_ => changeAvailabiltiy(doctor.id, true)} className="doctor-button unavailable">Unavailable</button>
            ,
            <button onClick={_ => removeDoctor(doctor.id)} className="remove-doctor doctor-button">Delete</button>

        ]
    ))

    const navigate = useNavigate()

    return (
        <div className="doctors-list">
            <Popup
            trigger={<button className="add-doctors-button">Add Doctor</button>}
            position="right center"
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
            features={["Name", "Specialization", "Toggle Availability", ""]}
            dataItems={data}/>
            }
        </div>
    )
}

type appointment = {
    id: number,
    date: string,
    doctor_id: number,
    doctor_name: string,
    patient_name: string,
    hospital_name: string,
    end_time: string,
    start_time: string,
    patient_concerns: string,
    patient_id: number,
    patient_review: string | null,
    patient_satisfaction: string | null,
    sentiment: sentiment
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
    doctors: Array<doctor>,
    appointments: Array<appointment>,
    overall_score: sentiment
}

function AppointmentCard({appt}: {appt: appointment}) {
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

function SentimentChart({sentiment}: {sentiment: sentiment}) {
    console.log(sentiment)
    const data = [
        {title: 'Positive', value: sentiment.pos, color: '#04AA6D'},
        {title: 'Negative', value: sentiment.neg, color: '#c92a35'},
        {title: 'Neutral', value: sentiment.neu, color: '#bfbfbf'}
    ]

    const formatScore = (score: number): string => {
        return `${(Math.round(score * 100)).toFixed(2)}%`
    }
    return (
        <div className="sentiment-chart">
            <PieChart
            animate={true}
            data={data}/>
            <div className="legend">
                <span className="pos">Positive - {formatScore(sentiment.pos)}</span>
                <span className="neu">Neutral - {formatScore(sentiment.neu)}</span>
                <span className="neg">Negative - {formatScore(sentiment.neg)}</span>
            </div>
        </div>
    )
}

function AppointmentList(props: {appointments: Array<appointment>, overallScore: sentiment}) {
    const apptData = props.appointments.map((appt, _) => (
        [
            appt.doctor_name,
            appt.patient_name,
            appt.date,
            <Popup trigger={<button className="add-doctors-button appt-details">View Details</button>} position={"left center"}>
                <AppointmentCard appt={appt}/>
            </Popup>
        ]
    ))
    return (
        <div className="appointment-list">
            {props.appointments.length === 0 ?
            <h1 className="no-appointments">No appointments have been made yet</h1>
            :
            <>
            <div className="overall-score">
                <h1>Overall Average Review Score </h1>
                <SentimentChart sentiment={props.overallScore}/>
            </div>
            <ItemsList dataItems={apptData} features={["Doctor", "Patient", "Date", ""]}/>
            </>
            }
        </div>
    )
}

function MainDashboard({data}: {data: dashboardData}) {
    const [selected, setSelected] = useState<number>(0)
    const buttonNames = ["Manage doctors", "Appointments"]

    const mainContents = [
        <DoctorList doctors={data.doctors}/>,
        <AppointmentList overallScore={data.overall_score} appointments={data.appointments}/>
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
    makeField('Phone Contact', 'phone', 'phone'),
    makeField('Opening time', 'time', 'open_time'),
    makeField('Closing time', 'time', 'close_time')
]

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
            <Header title="Admin Dashboard"></Header>
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