import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import ItemsList from "../components/item-list"
import client from "../client"
import { formatTime } from "../utils"

import "../../styles/portal.css"
import PopupSelector from "../components/popup-selector"
import Popup from "reactjs-popup"

import { PatientsAppointment, TimeSlot } from "../interfaces/appointment"
import { PatientHospital } from "../interfaces/hospital"
import { Doctor } from "../interfaces/doctor"
import Header from "../components/header"

function ReviewForm(props: {id: number, getAppointments: Function}) {
    const [satisfaction, setSatisfaction] = useState<number>(3)
    const [review, setReview] = useState<string>("")

    const changeText = (text: string) => {
        if (text.length > 150) {
            return
        }

        setReview(text)
    }

    const submitReview = () => {
        client.patch(`/appointment/review/${props.id}`, {
            patient_satisfaction: satisfaction,
            patient_review: review
        }).then(_ => props.getAppointments())
    }
    
    return (
        <div className="review-form">
            <h1>Submit a review</h1>
            <div>
                <h2>Rate your overall satisfaction</h2>
                <div className="satisfaction-buttons">
                {[1, 2, 3, 4, 5].map((value, _) => (
                    <div className="sat-button-container">
                        <span>{value}</span>
                        <input onClick={_ => setSatisfaction(value)} checked={value === satisfaction} type="radio"/>
                    </div>
                ))}
                </div>
            </div>
            <div className="text-review">
                <h2>Text review</h2>
                <span>{150 - review.length}</span>
                <textarea rows={6} cols={40} onChange={e => changeText(e.target.value)} value={review}/>
            </div>
           <button onClick={_ => submitReview()} className="appointments-button-active submit">Submit</button>
        </div>
    )
}

function SymptomsSuggester(props: {symptomsText: string, suggestedText: string, isOpen: boolean, setOpen: Function, setSymptoms: Function}) {
    return (
        <Popup open={props.isOpen} onClose={_ => props.setOpen(false)}>
            <div className="symptoms-suggester">
                <h1>Use suggestions to better describe your symptoms</h1>
                <div className="text-comparisons">
                    <div className="suggester-text">{props.symptomsText}</div>
                    <div className="suggester-divider">
                        <div className="line-divider"/>
                        <span>&darr;</span>
                        <div className="line-divider"/>
                    </div>
                    <div className="suggester-text">{props.suggestedText}</div>
                </div>
                <div className="button-choices">
                    <button className="review-button" onClick={_ => {
                        props.setOpen(false)
                        props.setSymptoms(props.suggestedText)
                    }}>Apply</button>
                    <button className="review-button discard-button" onClick={_ => {
                        props.setOpen(false)
                    }}>Discard</button>
                </div>
            </div>
        </Popup>
    )
}

function AppointmentsList() {
    const [appointments, setAppointments] = useState<Array<PatientsAppointment>>([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const getAppointments = () => {
        client.get('/appointment/patient', {withCredentials: true}).then(response => {
            setAppointments(response.data)
            setLoading(false)
        }).catch(error => {
            if (error.response.status === 401) {
                navigate('/login')
            }
        })
    }
    useEffect(() => {
       getAppointments()
    }, [])

    const appointmentData = appointments.map(value => ([
        value.hospital_name,
        value.doctor_name,
        value.date,
        `${formatTime(value.start_time)} - ${formatTime(value.end_time)}`,
        value.patient_satisfaction === null ?  
        <Popup
        trigger={<button className="review-button">Review</button>}
        position={"left center"}><ReviewForm getAppointments={getAppointments} id={value.id}/></Popup>
        :
        <button className="reviewed-button">Reviewed</button>
    ]))

    if (loading) return null
    return (
        <div className="appointment-list">
            {appointments !== undefined && appointments.length > 0 ? 
            <ItemsList
            features={["Hospital", "Doctor", "Date", "Time", ""]}
            dataItems={appointmentData}/> : <h1 className="no-appointments">Appointments you make will appear here</h1>}
        </div>
    )
}
function AppointmentScheduler() {
    const navigate = useNavigate()

    const [hospitals, setHospitals] = useState<Array<PatientHospital>>([])
    const [doctors, setDoctors] = useState<Array<Doctor>>([])

    const [times, setTimes] = useState<Array<TimeSlot>>()

    const [hospitalChoice, setHospitalChoice] = useState<number>()
    const [doctorChoice, setDoctorChoice] = useState<number>()
    const [date, setDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<number>(0)
    const [symptoms, setSymptoms] = useState<string>("")
    const symptomMaxLength = 500;

    const [showSuggetions, setShowSuggestions] = useState<boolean>(false)
    const [suggestedText, setSuggestedText] = useState<string>("")

    const updateSymptoms = (text: string) => {
        if (text.length > symptomMaxLength) {
            return
        }

        setSymptoms(text)
    }

    const [loading, setLoading] = useState<boolean>(true)

    const isWeekday = (date: Date): boolean => {
        const day = date.getDay()
        return day !== 0 && day !== 6
    }

    useEffect(() => {
        client.get('/hospital/', {withCredentials: true}).then(response => {
            setHospitals(response.data)
            setLoading(false)
        })
    }, [])
    
    useEffect(() => {
        client.get(`/doctor/available/${hospitalChoice}`, {withCredentials: true}).then(response => {
            setDoctors(response.data)
        })
    }, [hospitalChoice])

    const updateDate = (date: Date) => {
        setDate(date)
    }

    useEffect(() => {
        if (date === undefined) return
        const formatted_date = date.toISOString().split("T")[0]

        client.get(`/appointment/times/${doctorChoice}/${formatted_date}`, { withCredentials: true})
            .then(response => {
                setTimes(response.data)
            })
    }, [doctorChoice, date])

    const getAndShowSuggestions = () => {
        client.post('/appointment/suggestions', {
            text: symptoms
        }, {withCredentials: true}).then((response) => {
            setSuggestedText(response.data.output_text)
            setShowSuggestions(true)
        })
    }

    const submitAppointment = () => {
        if (times === undefined) {
            return
        }
        
        client.post('/appointment/create', {
            doctor_id: doctorChoice,
            ...times[selectedTime],
            date: date?.toISOString().split("T")[0],
            patient_symptoms: symptoms
        }).then(_ => navigate(0))
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

    const doctorItems = doctors?.map((doctor, _) => (
        {
            "name": `${doctor.first_name} ${doctor.last_name}`,
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
                        {times === undefined ? "" : `${formatTime(times[selectedTime].start_time)} - ${formatTime(times[selectedTime].end_time)}`}
                    </button>}
                    position={"right center"}
                    >
                        <div className="time-list">
                            {times?.map((value, idx) => (
                                <button onClick={_ => setSelectedTime(idx)}>{formatTime(value.start_time)} - {formatTime(value.end_time)}</button>
                            ))}
                        </div>
                    </Popup>
                </div>
            </div>
            <div className="symptoms-input">
                <h1>Symptoms</h1>
                {symptoms.length > 10 && symptoms != suggestedText ?
                <button onClick={_ => {
                    getAndShowSuggestions()
                }} className="review-button show-suggestions-button">Show suggestions</button>
                : null
                }
                <SymptomsSuggester
                isOpen={showSuggetions} setOpen={setShowSuggestions}
                symptomsText={symptoms} suggestedText={suggestedText}
                setSymptoms={setSymptoms}/>
                <span>{symptomMaxLength - symptoms.length}</span>
                <textarea rows={5} cols={40} value={symptoms} onChange={e => updateSymptoms(e.target.value)}/>
            </div>
            <button onClick={_ => submitAppointment()} className="appointments-button-active submit">Schedule</button>
        </div>
    )
}

function PatientPortal() {
    const [displayAppts, setDisplayAppts] = useState<boolean>(true)

    return (
        <div className="patient-portal">
            <Header userRole="patient" title="Patient Portal"/>
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
                <AppointmentsList/> :
                <AppointmentScheduler/>}
            </div>
        </div>
    )
}

export default PatientPortal