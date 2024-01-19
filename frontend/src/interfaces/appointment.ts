export interface TimeSlot {
    start_time: string,
    end_time: string
}

export interface PatientsAppointment {
    id: number,
    hospital_name: string,
    doctor_name: string
    doctor_id: number,
    start_time: string,
    end_time: string,
    date: string,
    patient_concerns: string,
    patient_review?: string,
    patient_satisfaction?: number,
    sentiment?: {
        pos: number,
        neu: number,
        neg: number
    }
}

// don't want to directly show patients what their own id is
export interface AdminsAppointment extends PatientsAppointment {
    patient_id: number,
    patient_name: number,
}