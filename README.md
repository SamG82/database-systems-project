Database Systems Project
Application Systems Domain
We propose a healthcare appointment booking application. While all hospitals have their own form of registration and scheduling systems, they are only at the individual hospital level. Our system proposes a four-entity system, with patients, their doctors, the hospitals that each doctor works at, and all the patients’ appointments. Our system is unique because it will let users be able to schedule an appointment at any hospital at a certain level (whether regional or global, depending on the success of the app), which would make it much easier for both patients, doctors, and hospitals to keep track of their appointments. 

We will pre-program the data for the hospitals and doctors, which can only be updated through a different portal that will not be accessible to the public. We will have an open form that only allows users to create accounts, and set up appointments, but not register as doctors or hospitals. These users will be required to input their first and last name, and a valid ID. The appointment will require a hospital picked, a doctor that works there, and to select an appointment time. Each doctor will need a valid ID and their available appointment times. Each hospital needs a hospital ID and all the doctor names that work there. Our advanced function will be an analytical page that is accessible by the hospitals, which will allow them to see the total number of appointments that have been filled up at their hospital only, without allowing access to every hospital. This makes it easy to guarantee there are no scheduling errors and determine if the hospital is getting too busy to require more doctors.
The relationships would be Hospital-doctors (one to many), Appointment-doctor (one to one), Appointment-patient (one to one), Patient-appointments (one to many)

We believe this system would be highly efficient and make for an effective tool that benefits both doctors, hospitals, and patients by increasing ease of access and reducing clutter.