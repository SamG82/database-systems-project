
type Appointment = {
    doctorName: string,
    hospitalName: string,
    startTime: string
    endTime: string,
    date: string,
    notes: string
}

type Props = {
    appt: Appointment
}

function AppointmentRow(props: Props) {
    return (
        <>
            <span>{props.appt.hospitalName}</span>
            <span>{props.appt.doctorName}</span>
            <span>{`${props.appt.startTime} - ${props.appt.endTime}`}</span>
            <span>{props.appt.date}</span>
            <button className="review-button">Add Review</button>
        </>
            
    )
}

export default AppointmentRow