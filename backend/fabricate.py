import models
from auth import hash_pw

admins = [
    ('Test Admin 1', 'Main Street', 'test1@admin.com', 'test1'),
    ('Test Admin 2', 'South Street', 'test2@admin.com', 'test2'),
    ('Test Admin 3', 'North Street', 'test3@admin.com', 'test3'),
    ('Test Admin 4', 'West Street', 'test4@admin.com', 'test4'),
    ('Test Admin 5', 'East Street', 'test5@admin.com', 'test5')
]

hospitals = [
    ('Mayo Clinic', 'Main Street', '8:00', '17:00', 11231231234),
    ('Cleveland Clinic', 'South Street', '9:00', '16:30', 11111111111),
    ('East Georgia Medical Center', 'North Street', '10:00', '17:30', 12222222222),
    ("St. Joseph's Candler", 'West Street', '8:00', '13:30', 13333333333),
    ('Optim Medical Center', 'East Street', '7:00', '17:00', 14444444444)
]

doctors = [
    [
        ('Ciara Harper', 'Cardiologist'),
        ('Timothy Oconnell', 'Oncologist'),
        ('Sebastian Ryan', 'Sleep Specialist')
    ],
    [
        ('Miles Marsh', 'Dermatologist'),
        ('Alison Jenkins', 'Cardiologist'),
        ('Tyrese Nunez', 'Neurologist'),
        ('Conner Walter', 'Allergist')
    ],
    [
        ('Alexandira Hull', 'Radiologist'),
        ('Jude Rivera', 'Endocrinologist'),
        ('Alana Simmons', 'Pediatrician')
    ],
    [
        ('Fynn Schultz', 'Oncologist'),
        ('Kenny Chandler', 'Neurologist'),
        ('Elisa Gentry', 'Cardiologist'),
        ('Everly Harris', 'Dermatologist'),
        ('Denzel Rhodes', 'Gastroenterologist')
    ],
    [
        ('Luna Mcdaniel', 'Psychiatrist'),
        ('Nelson Roy', 'Family Medicine')
    ]
]

patients = [
    ('Philip Fischer', 15005753034, 'Main Street', 'test1@patient.com', 'test1'),
    ('Aliyah Contreras', 13405749760, 'South Street', 'test2@patient.com', 'test2'),
    ('Saul Morgan', 18719866247, 'North Street', 'test3@patient.com', 'test3'),
    ('Edward Frye', 15114893932, 'West Street', 'test4@patient.com', 'test4'),
    ('Annie Hansen', 16548504164, 'East Street ', 'test5@patient.com', 'test5')
]

def fabricate_data():
    for admin, hospital, doctor_list in zip(admins, hospitals, doctors):
        a = models.Admin(admin[0], admin[1], admin[2], hash_pw(admin[3]))
        h = models.Hospital(hospital[0], hospital[1], hospital[3], hospital[2], hospital[4])
        for doc in doctor_list:
            d = models.Doctor(name=doc[0], specialization=doc[1])
            h.doctors.append(d)
            models.db.session.add(d)

        a.hospital = h
        models.db.session.add(a)
        models.db.session.add(h)

    for patient in patients:
        p = models.Patient(patient[0], patient[1], patient[2], patient[3], hash_pw(patient[4]))
        models.db.session.add(p)

    models.db.session.commit()