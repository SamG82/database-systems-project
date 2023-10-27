
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

function AppointmentListing(props: Props) {
    return (
        <>
            <span>{props.appt.hospitalName}</span>
            <span>{props.appt.doctorName}</span>
            <span>{`${props.appt.startTime} - ${props.appt.endTime}`}</span>
            <span>{props.appt.date}</span>
            <button className="notes-button">Add Review</button>
        </>
            
    )
}

export default AppointmentListing