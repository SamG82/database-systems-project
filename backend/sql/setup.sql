DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Hospital;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS Appointment;
DROP TRIGGER IF EXISTS AppointmentTimeCheck;

CREATE TABLE Patient (
    id INTEGER PRIMARY KEY,
    first_name CHAR(30) NOT NULL,
    last_name CHAR(30) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE Hospital (
    id INTEGER PRIMARY KEY,
    name CHAR(50) NOT NULL UNIQUE,
    address CHAR(50) NOT NULL UNIQUE,
    appointment_length INTEGER NOT NULL CHECK(appointment_length >= 10 AND appointment_length <= 60),
    open_time CHAR(5) CHECK(open_time IS strftime('%H:%M', open_time)), --enforce time format
    close_time CHAR(5) CHECK(close_time IS strftime('%H:%M', close_time)), --enforce time format
    phone INTEGER NOT NULL UNIQUE,
    admin_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY(admin_id) REFERENCES Admin(id),
    
    -- appointment length needs to be 10 ~ 60 minutes and be a multiple of 5
    CHECK(appointment_length >= 10 AND appointment_length <= 60 AND appointment_length % 5 == 0),
    
    -- the open and close time minutes need to be multiples of 5 minutes
    CHECK(strftime('%M', open_time) % 5 == 0 and strftime('%M', close_time) % 5 == 0),
    
    -- open and close times to need to have a 2 hour gap minimum (hospital needs to be open for 2 or more hours)
    check(strftime('%s', close_time) - strftime('%s', open_time) >= 7200)
);

CREATE TABLE Doctor (
    id INTEGER PRIMARY KEY,
    first_name CHAR(30) NOT NULL,
    last_name CHAR(30) NOT NULL,
    specialization CHAR(30) NOT NULL,
    availability INTEGER NOT NULL DEFAULT 1 CHECK(availability IN (0, 1)), --boolean
    hospital_id INTEGER NOT NULL,
    FOREIGN KEY(hospital_id) REFERENCES Hospital(id)
);

CREATE TABLE Admin (
    id INTEGER PRIMARY KEY,
    first_name CHAR(30) NOT NULL,
    last_name CHAR(30) NOT NULL,
    email CHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE Appointment (
    id INTEGER PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    start_time CHAR(5) NOT NULL CHECK(start_time IS strftime('%H:%M', start_time)), --enforce time format
    end_time CHAR(5) NOT NULL CHECK(end_time IS strftime('%H:%M', end_time)), -- enforce time format
    date CHAR(10) NOT NULL CHECK(date IS strftime('%Y-%m-%d', date)), --enforce date format
    patient_concerns CHAR(150),
    patient_review CHAR(150),
    patient_satisfaction INTEGER CHECK((patient_satisfaction > 0 and patient_satisfaction < 6) or patient_satisfaction IS NULL),
    FOREIGN KEY(doctor_id) REFERENCES Doctor(id),
    FOREIGN KEY(patient_id) REFERENCES Patient(id),

    --make sure appointment minutes are multiples of 5
    CHECK(strftime('%M', start_time) % 5 == 0 AND strftime('%M', end_time) % 5 == 0)
);


--trigger to validate new appointment before inserting
CREATE TRIGGER validate_appointment BEFORE INSERT ON Appointment
BEGIN
	SELECT CASE
        -- make sure the new appointment's doctor is marked as available
        WHEN (SELECT availability FROM Doctor WHERE id=NEW.doctor_id) = 0
            THEN RAISE(ABORT, 'DOCTOR_UNAVAILABLE')
        -- make sure the appointments time duration is equal to the hospital's specified appointment_length
        WHEN strftime('%s', NEW.date || ' ' || NEW.end_time || ':00') - strftime('%s', NEW.date || ' ' || NEW.start_time || ':00')
            not IN 
            (SELECT appointment_length * 60 FROM Hospital WHERE id in (SELECT hospital_id FROM Doctor where id = NEW.doctor_id))
            THEN RAISE(ABORT, 'INVALID_TIME_LENGTH')
            
        -- check for times outside of the hospitals operating hours    
        WHEN strftime('%s', NEW.start_time) < strftime('%s', (SELECT open_time FROM Hospital WHERE id in (SELECT hospital_id FROM Doctor where id = NEW.doctor_id)))
            OR strftime('%s', NEW.end_time) > strftime('%s', (SELECT close_time FROM Hospital WHERE id in (SELECT hospital_id FROM Doctor where id = NEW.doctor_id)))
            THEN RAISE(ABORT, 'TIMES_OUTSIDE_OPERATING_HOURS')
        
        -- make sure appoints dont overlap with current ones
        WHEN EXISTS
            (SELECT * FROM Appointment where doctor_id=NEW.doctor_id AND date=NEW.date
                and strftime('%s', NEW.start_time) < strftime('%s', end_time) AND strftime('%s', start_time) < strftime('%s', NEW.end_time))
                THEN RAISE(ABORT, 'OVERLAPPING_EXISTING_APPOINTMENTS')
        
        -- appointments cant be scheduled with dates in the past
        WHEN strftime('%J', NEW.date) <= strftime('%J', date('now', 'localtime')) THEN RAISE(ABORT, 'UNALLOWED_PAST_DATES')
    END;          
END;