CREATE TABLE kenyaemr_etl.appointment_phase_two_dump (SELECT t.appointment_number,
    t.patient_id,
    ADDTIME(t.start_date_time, '06:00:00') AS start_date,
    ADDTIME(t.end_date_time, '20:00:00') AS end_date,
    t.appointment_service_id,
    t.status,
    t.location_id,
    t.appointment_kind,
    t.uuid,
    t.date_created,
    t.creator,
    t.voided,
    patient_appointment_id FROM
    (SELECT 
        h.refill_date,
            '000' AS appointment_number,
            h.patient_id,
            e.uuid AS enc_uuid,
            p.uuid AS app_uuid,
            p.patient_appointment_id,
           DATE(h.refill_date) AS start_date_time,
           DATE(h.refill_date) AS end_date_time,
            (CASE
                WHEN h.next_appointment_reason = 160521 THEN 2
                ELSE NULL
            END) AS appointment_service_id,
            'Scheduled' AS status,
            h.location_id,
            'Scheduled' AS appointment_kind,
            UUID() AS uuid,
            CURRENT_DATE() AS date_created,
            2 AS creator,
            h.voided
    FROM
        kenyaemr_etl.etl_patient_hiv_followup h
    JOIN encounter e ON h.encounter_id = e.encounter_id
    LEFT JOIN patient_appointment p ON (p.uuid = e.uuid)
    WHERE
        DATE(h.refill_date) >= DATE('2023-01-01')
            AND h.refill_date IS NOT NULL
    ) t);

insert into openmrs.patient_appointment (
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
voided,related_appointment_id)
select * from kenyaemr_etl.appointment_phase_two_dump;

drop table kenyaemr_etl.appointment_phase_two_dump;
