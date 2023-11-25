import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


import ItemsList from "../components/item-list"
import client from "../client"

import "../../styles/portal.css"
import PopupSelector from "../components/popup-selector"
import Popup from "reactjs-popup"

type timeSlots = {
    start: string,
    end: string
}[]

type appointment = {
    date: string,
    doctor_id: number,
    doctor_name: string,
    hospital_name: string,
    end_time: string,
    start_time: string,
    patient_concerns: string,
    patient_id: number,
    patient_review: string | null,
    patient_satisfaction: string | null
}

type portalData = {
    name: string,
    appointments: Array<appointment>
}

type hospitalData = {
    address: string,
    close_time: string,
    doctors: {
        available: boolean,
        id: number,
        name: string,
        specialization: string,
    }[],
    id: number,
    name: string,
    open_time: string,
    phone: number
}[]

function AppointmentsList(props: {appointments: Array<appointment>}) {
    const appointmentData = props.appointments.map(value => ([
        value.doctor_name,
        value.date,
        `${value.start_time} - ${value.end_time}`
    ]))

    return (
        <div className="appointment-list">
            {props.appointments.length > 0 ? 
            <ItemsList
            features={["Hospital", "Doctor", "Date", "Time"]}
            dataItems={appointmentData}/> : <h1 className="no-appointments">Appointments you make will appear here</h1>}
        </div>
    )
}
function AppointmentScheduler() {
    const [hospitals, setHospitals] = useState<hospitalData>()
    const [times, setTimes] = useState<timeSlots>()

    const [hospitalChoice, setHospitalChoice] = useState<number>()
    const [doctorChoice, setDoctorChoice] = useState<number>()
    const [date, setDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<number>(0)
    const [concerns, setConcerns] = useState<string>("")

    const updateConcerns = (text: string) => {
        if (text.length > 150) {
            return
        }

        setConcerns(text)
    }

    const [loading, setLoading] = useState<boolean>(true)

    const formatTime = (time: string): string => {
        const split_str = time.split(":")
        let hours = split_str[0]
        let minutes = split_str[1]
        let suffix = "AM"

        hours = hours.replace("0", "")
        if (Number(hours) > 12) {
            hours = String(Number(hours) - 12)
            suffix = "PM"
        } else if (Number(hours) == 12) {
            suffix = "PM"
        }
        return `${hours}:${minutes} ${suffix}`
    }

    const isWeekday = (date: Date): boolean => {
        const day = date.getDay()
        return day !== 0 && day !== 6
    }

    useEffect(() => {
        client.get('/hospitals', {withCredentials: true}).then(response => {
            setHospitals(response.data)
            setLoading(false)
        })
    }, [])
    
    const updateDate = (date: Date) => {
        setDate(date)
        const formatted_date = date.toISOString().split("T")[0]
        client.get(`/appointment/times/${formatted_date}/${doctorChoice}`, { withCredentials: true})
            .then(response => {
                setTimes(response.data)
            })
    }

    const hospitalItems = hospitals?.map((hos, _) => (
        {
            "name": hos.name,
            "id": hos.id,
            "features": {
                "Address": hos.address,
                "Hours": `${formatTime(hos.open_time)} - ${formatTime(hos.close_time)}`,
                "Phone": hos.phone
            }
        }
    ))

    const doctorItems = hospitals?.find(h => h.id === hospitalChoice)?.doctors.map((doctor, _) => (
        {
            "name": doctor.name,
            "id": doctor.id,
            "features": {
                "Specialization": doctor.specialization
            }
        }
    ))

    if (loading) return null
    return (
        <div className="appointment-scheduler">
            <div className="appointment-options">
                <PopupSelector
                title="Hospital"
                selected={hospitalChoice}
                items={hospitalItems}
                setSelected={setHospitalChoice}/>
                <PopupSelector
                title="Doctor"
                selected={doctorChoice}
                items={doctorItems}
                setSelected={setDoctorChoice}/>
                <div className="date-selector">
                    <h1>Date</h1>
                    <DatePicker
                    selected={date}
                    onChange={(date: Date) => updateDate(date)}
                    minDate={new Date()}
                    filterDate={isWeekday}
                    />
                </div>
                <div className="time-picker">
                    <h1>Time</h1>
                    <Popup
                    trigger={
                    <button className="selector-button">
                        {times === undefined ? "" : `${formatTime(times[selectedTime].start)} - ${formatTime(times[selectedTime].end)}`}
                    </button>}
                    position={"right center"}
                    >
                        <div className="time-list">
                            {times?.map((value, idx) => (
                                <button onClick={_ => setSelectedTime(idx)}>{formatTime(value.start)} - {formatTime(value.end)}</button>
                            ))}
                        </div>
                    </Popup>
                </div>
            </div>
            <div className="concerns-input">
                <h1>Concerns</h1>
                <span>{150 - concerns.length}</span>
                <textarea rows={5} cols={40} value={concerns} onChange={e => updateConcerns(e.target.value)}/>
            </div>
        </div>
    )
}

function PatientPortal() {
    const navigate = useNavigate()
    const [portal, setPortal] = useState<portalData>({
        name: "",
        appointments: []
    })
    const [loading, setLoading] = useState<boolean>(true)
    const getPatientDetails = () => {
        client.get("/portal", {withCredentials: true}).then(response => {
            setPortal(response.data)
            setLoading(false)
        }).catch(_ => navigate("/login"))
    }

    // get dashboard details whenever loaded
    useEffect(() => {
        getPatientDetails()
    }, [])

    const [displayAppts, setDisplayAppts] = useState<boolean>(true)

    if (loading) return null
    return (
        <div className="patient-portal">
            <div className="portal-header">
                <h1>Patient Portal</h1>
                <h3>Welcome back, <span className="patient-name">{portal?.name}</span></h3>
                <span className="spacer"></span>
            </div>
            <div className="appointment-manager">
                <div className="appointment-header">
                    <h1>Appointment Manager</h1>
                    <div className="appointment-buttons">
                        <button
                        onClick={() => setDisplayAppts(true)}
                        className={displayAppts ? "appointments-button-active" : "appointments-button"}>View appointments</button>
                        <button
                        onClick={() => setDisplayAppts(false)}
                        className={!displayAppts ? "appointments-button-active" : "appointments-button"}>Schedule new appointment</button>
                    </div>
                </div>
                {displayAppts ?
                <AppointmentsList appointments={portal.appointments}/> :
                <AppointmentScheduler/>}
            </div>
        </div>
    )
}

export default PatientPortal