-- Sample data for development and testing
-- This file contains sample data to populate the database for testing purposes

-- Insert sample organization
INSERT INTO organizations (id, name, type, address, phone, email) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Clínica San Rafael',
    'clinic',
    'Av. Libertador 1234, Buenos Aires, Argentina',
    '+54 11 4567-8900',
    'info@clinicasanrafael.com'
);

-- Insert sample users
INSERT INTO users (id, organization_id, email, first_name, last_name, role, phone, license_number, specialization) VALUES
(
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'admin@clinicasanrafael.com',
    'Ana',
    'García',
    'admin',
    '+54 11 4567-8901',
    NULL,
    NULL
),
(
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'dr.martinez@clinicasanrafael.com',
    'Carlos',
    'Martínez',
    'doctor',
    '+54 11 4567-8902',
    'MP-12345',
    'Medicina General'
),
(
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'dr.lopez@clinicasanrafael.com',
    'María',
    'López',
    'doctor',
    '+54 11 4567-8903',
    'MP-12346',
    'Cardiología'
),
(
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'enfermera.silva@clinicasanrafael.com',
    'Laura',
    'Silva',
    'nurse',
    '+54 11 4567-8904',
    'ENF-789',
    NULL
),
(
    '00000000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'recepcion@clinicasanrafael.com',
    'Pedro',
    'Ruiz',
    'receptionist',
    '+54 11 4567-8905',
    NULL,
    NULL
);

-- Insert sample patients
INSERT INTO patients (
    id, organization_id, patient_number, first_name, last_name, dni, email, phone, 
    birth_date, gender, address, city, postal_code, 
    insurance_provider, insurance_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    blood_type, allergies
) VALUES
(
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'PAT-001',
    'Juan',
    'Pérez',
    '12345678',
    'juan.perez@email.com',
    '+54 11 9876-5432',
    '1980-05-15',
    'male',
    'Calle Falsa 123',
    'Buenos Aires',
    '1000',
    'OSDE',
    '123456789',
    'María Pérez',
    '+54 11 9876-5433',
    'Esposa',
    'O+',
    'Penicilina'
),
(
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'PAT-002',
    'Sofia',
    'González',
    '87654321',
    'sofia.gonzalez@email.com',
    '+54 11 8765-4321',
    '1992-08-22',
    'female',
    'Av. Corrientes 456',
    'Buenos Aires',
    '1001',
    'Swiss Medical',
    '987654321',
    'Roberto González',
    '+54 11 8765-4322',
    'Padre',
    'A-',
    'Ninguna conocida'
),
(
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'PAT-003',
    'Miguel',
    'Rodríguez',
    '11223344',
    'miguel.rodriguez@email.com',
    '+54 11 7654-3210',
    '1975-12-03',
    'male',
    'San Martín 789',
    'Buenos Aires',
    '1002',
    'Galeno',
    '111222333',
    'Carmen Rodríguez',
    '+54 11 7654-3211',
    'Esposa',
    'B+',
    'Aspirina, Mariscos'
);

-- Insert sample appointments (next 7 days)
INSERT INTO appointments (
    id, organization_id, patient_id, doctor_id, title, description, appointment_date, 
    duration, status, reason_for_visit, created_by
) VALUES
(
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000011',
    'Consulta General - Juan Pérez',
    'Control rutinario de salud',
    NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
    30,
    'scheduled',
    'Control rutinario anual',
    '00000000-0000-0000-0000-000000000014'
),
(
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000012',
    'Consulta Cardiología - Sofia González',
    'Evaluación cardiológica de rutina',
    NOW() + INTERVAL '2 days' + INTERVAL '14 hours',
    45,
    'confirmed',
    'Dolor en el pecho ocasional',
    '00000000-0000-0000-0000-000000000014'
),
(
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000011',
    'Consulta General - Miguel Rodríguez',
    'Control de diabetes',
    NOW() + INTERVAL '3 days' + INTERVAL '10 hours',
    30,
    'confirmed',
    'Control de glucemia',
    '00000000-0000-0000-0000-000000000014'
);

-- Insert sample medical records
INSERT INTO medical_records (
    id, organization_id, patient_id, doctor_id, appointment_id,
    chief_complaint, symptoms, diagnosis, treatment_plan, prescription,
    vital_signs, follow_up_instructions
) VALUES
(
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000011',
    NULL,
    'Dolor de cabeza frecuente',
    'Cefalea tensional, fatiga, estrés laboral',
    'Cefalea tensional',
    'Descanso, manejo del estrés, analgésicos según necesidad',
    '[{"medication": "Paracetamol", "dosage": "500mg", "frequency": "cada 8h", "duration": "3 días"}]',
    '{"blood_pressure": "120/80", "temperature": "36.5", "heart_rate": "72", "weight": "75"}',
    'Regresar en 2 semanas si persisten los síntomas'
),
(
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000012',
    NULL,
    'Palpitaciones ocasionales',
    'Palpitaciones leves, sin dolor torácico, relacionado con estrés',
    'Palpitaciones benignas relacionadas con ansiedad',
    'Técnicas de relajación, seguimiento en 1 mes',
    '[]',
    '{"blood_pressure": "115/75", "temperature": "36.3", "heart_rate": "78", "weight": "62"}',
    'Continuar con técnicas de manejo del estrés'
);

-- Insert sample medical history
INSERT INTO medical_history (
    id, organization_id, patient_id, category, title, description, severity, onset_date
) VALUES
(
    '00000000-0000-0000-0000-000000000050',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000020',
    'allergy',
    'Alergia a Penicilina',
    'Reacción alérgica moderada con erupciones cutáneas',
    'moderate',
    '2010-03-15'
),
(
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000022',
    'chronic_condition',
    'Diabetes Tipo 2',
    'Diabetes mellitus tipo 2 controlada con dieta y ejercicio',
    'moderate',
    '2020-01-10'
),
(
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000022',
    'allergy',
    'Alergia a Mariscos',
    'Reacción alérgica severa con dificultad respiratoria',
    'severe',
    '2005-07-20'
);