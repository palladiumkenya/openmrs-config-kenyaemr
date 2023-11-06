create table kenyaemr_etl.appointment_phase_three_dump(
SELECT 
    t.related_appointment_id AS followup_related_appointment_id,
    t.patient_appointment_id AS followup_patient_appointment_id,
    p.patient_appointment_id AS refill_patient_appointment_id,
    p.start_date_time AS refill_date,
    p.related_appointment_id AS refill_related,
    p.patient_id
FROM
    openmrs.patient_appointment p
        LEFT JOIN
    openmrs.patient_appointment t ON (p.related_appointment_id = t.patient_appointment_id)
WHERE
    p.related_appointment_id = t.patient_appointment_id );
    
UPDATE openmrs.patient_appointment a
INNER JOIN kenyaemr_etl.appointment_phase_three_dump b ON a.patient_appointment_id = b.followup_patient_appointment_id and a.patient_id = b.patient_id
SET a.related_appointment_id = b.refill_patient_appointment_id
where a.appointment_service_id =1 ;

drop table kenyaemr_etl.appointment_phase_three_dump;

-- end of dump three
