INSERT INTO openmrs.patient_appointment (
    appointment_number,
    patient_id,
    start_date_time,
    end_date_time,
    appointment_service_id,
    status,
    location_id,
    appointment_kind,
    uuid,
    date_created,
    creator,
    voided
)
SELECT 
    '000' AS appointment_number,
    h.patient_id,
        CONCAT(DATE(h.next_appointment_date),
            ' 06:00:00') AS start_date_time,
    CONCAT(DATE(h.next_appointment_date),
            ' 20:00:00') AS end_date_time,
    (CASE
        WHEN h.next_appointment_reason = 160523 THEN 1
        WHEN h.next_appointment_reason = 1283 THEN 12
        WHEN h.next_appointment_reason = 159382 THEN 11
        WHEN h.next_appointment_reason = 160521 THEN 1
        ELSE NULL
    END) AS appointment_service_id,
    'Scheduled' AS status,
    h.location_id,
    'Scheduled' AS appointment_kind,
    e.uuid AS uuid,
    CURRENT_DATE() AS date_created,
    2 AS creator,
    h.voided
FROM
    kenyaemr_etl.etl_patient_hiv_followup h
        JOIN
    encounter e ON h.encounter_id = e.encounter_id
WHERE
    h.next_appointment_date >= '2022-11-01'
  
