export interface PatientHospital {
    id: number,
    name: string,
    address: string,
    open_time: string,
    close_time: string,
    phone: number
}

export interface AdminHospital extends PatientHospital {
    appointment_length: number
}