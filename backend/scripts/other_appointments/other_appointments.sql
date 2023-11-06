-- Prep initial
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, 
 ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number,
 h.patient_id, date(mid(max(concat(h.visit_date, h.appointment_date)),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.appointment_date) )),11)) as end_date_time,
7 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_prep_followup h
join encounter e on h.encounter_id = e.encounter_id 
where date(h.appointment_date) >= date("2022-11-08") and h.form = 'prep-initial' 
GROUP BY h.patient_id ) AS t;

 -- Prep monthly refill
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number,
 h.patient_id, date(mid(max(concat(h.visit_date, h.next_appointment )),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.next_appointment) )),11)) as end_date_time,
9 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_prep_monthly_refill h
join encounter e on h.encounter_id = e.encounter_id where date(h.next_appointment) >= date("2022-11-08") 
GROUP BY h.patient_id ) AS t;

-- Prep Followup
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, 
 ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number,
 h.patient_id, date(mid(max(concat(h.visit_date, h.appointment_date )),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.appointment_date) )),11)) as end_date_time,
8 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_prep_followup h
join encounter e on h.encounter_id = e.encounter_id 
where date(h.appointment_date) >= date("2022-11-08") and h.form = 'prep-consultation' 
GROUP BY h.patient_id ) AS t;


-- Tb Followup
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number,
 h.patient_id, date(mid(max(concat(h.visit_date, h.next_appointment_date)),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.next_appointment_date))),11)) as end_date_time,
6 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_tb_follow_up_visit h
join encounter e on h.encounter_id = e.encounter_id where date(h.next_appointment_date) >= date("2022-11-08") 
GROUP BY h.patient_id ) AS t;

-- Kp clinical visit 
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
voided)
select  t.appointment_number,
 t.client_id as patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number,
 h.client_id, date(mid(max(concat(h.visit_date, h.appointment_date)),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.appointment_date) )),11)) as end_date_time,
3 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind,
mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
CURRENT_DATE() as date_created, 2 as creator,
e.voided from kenyaemr_etl.etl_clinical_visit h
join encounter e on h.encounter_id = e.encounter_id where date(h.appointment_date) >= date("2022-11-08") 
GROUP BY h.client_id ) AS t;


-- Postnatal not in HEI followup
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number, p.patient_id, date(mid(max(concat(p.visit_date, p.appointment_date )),11)) as start_date_time,
date(mid(max(concat(p.visit_date,(p.appointment_date) )),11)) as end_date_time,
5 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_hei_follow_up_visit h
join openmrs.encounter e on h.encounter_id = e.encounter_id 
left join kenyaemr_etl.etl_mch_postnatal_visit p on p.encounter_id = e.encounter_id
where date(p.appointment_date) >= date("2022-11-08") and h.encounter_id is null
GROUP BY h.patient_id ) AS t;


-- Antenatal not in hei followup
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number, p.patient_id, date(mid(max(concat(p.visit_date, p.next_appointment_date )),11)) as start_date_time,
date(mid(max(concat(p.visit_date,(p.next_appointment_date) )),11)) as end_date_time,
4 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_hei_follow_up_visit h
join openmrs.encounter e on h.encounter_id = e.encounter_id 
left join kenyaemr_etl.etl_mch_antenatal_visit p on p.encounter_id = e.encounter_id
where date(p.next_appointment_date) >= date("2022-11-08") and h.encounter_id is null
GROUP BY h.patient_id ) AS t;

-- CWC Followup not in Postnatal or Antenatal
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from 
 (select "000" as appointment_number, h.patient_id,
 date(mid(max(concat(h.visit_date, h.next_appointment_date )),11)) as start_date_time,
date(mid(max(concat(h.visit_date,(h.next_appointment_date) )),11)) as end_date_time,
13 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_hei_follow_up_visit h
join openmrs.encounter e on h.encounter_id = e.encounter_id 
left join kenyaemr_etl.etl_mch_postnatal_visit p on p.encounter_id = e.encounter_id
left join kenyaemr_etl.etl_mch_antenatal_visit a on a.encounter_id = e.encounter_id
left join kenyaemr_etl.etl_mchs_delivery d on d.encounter_id = e.encounter_id
where date(h.next_appointment_date) >= date("2022-11-08") and p.encounter_id is null and a.encounter_id is null
GROUP BY h.patient_id ) AS t;

-- Postnatal in hei
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number, p.patient_id, date(mid(max(concat(p.visit_date, p.appointment_date )),11)) as start_date_time,
date(mid(max(concat(p.visit_date,(p.appointment_date) )),11)) as end_date_time,
5 as appointment_service_id,"Scheduled" as status, h.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_hei_follow_up_visit h
join openmrs.encounter e on h.encounter_id = e.encounter_id 
inner join kenyaemr_etl.etl_mch_postnatal_visit p on p.encounter_id = e.encounter_id
where date(p.appointment_date) >= date("2022-11-08") and h.encounter_id = p.encounter_id
GROUP BY h.patient_id ) AS t;

-- Antenatal in hei
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
voided)
select  t.appointment_number,
 t.patient_id,ADDTIME(t.start_date_time, "06:00:00") as start_date, ADDTIME(t.end_date_time, "20:00:00") as end_date ,
 t.appointment_service_id, t.status, t.location_id, t.appointment_kind, t.uuid, t.date_created, t.creator,
 t.voided from (select "000" as appointment_number, a.patient_id, date(mid(max(concat(a.visit_date, a.next_appointment_date )),11)) as start_date_time,
date(mid(max(concat(a.visit_date,(a.next_appointment_date) )),11)) as end_date_time,
4 as appointment_service_id,"Scheduled" as status, a.location_id,
"Scheduled" as appointment_kind, mid(max(concat(date(e.encounter_datetime),e.uuid)),11)  as uuid,
 CURRENT_DATE() as date_created, 2 as creator,e.voided from kenyaemr_etl.etl_hei_follow_up_visit h
join openmrs.encounter e on h.encounter_id = e.encounter_id 
inner join kenyaemr_etl.etl_mch_antenatal_visit a on a.encounter_id = e.encounter_id
where date(a.next_appointment_date) >= date("2022-11-08") and h.encounter_id = a.encounter_id
GROUP BY h.patient_id ) AS t;

-- Create appointment for baby from postnatal form
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
voided,
related_appointment_id
)
SELECT  t.appointment_number, t.patient_id,ADDTIME(t.start_date_time, '06:00:00') AS start_date,
 ADDTIME(t.end_date_time, '20:00:00') AS end_date, t.appointment_service_id, t.status, t.location_id,
t.appointment_kind, t.uuid, t.date_created, t.creator, t.voided, t.patient_appointment_id
FROM (SELECT '000' AS appointment_number, a.patient_id,
            DATE(MID(MAX(CONCAT(a.visit_date, a.appointment_date)), 11)) AS start_date_time,
            DATE(MID(MAX(CONCAT(a.visit_date, (a.appointment_date))), 11)) AS end_date_time,
            13 AS appointment_service_id,
            'Scheduled' AS status,
            a.location_id,
            'Scheduled' AS appointment_kind,
            uuid() AS uuid,
            CURRENT_DATE() AS date_created,
            2 AS creator,
            e.voided,
            p.patient_appointment_id
    FROM
        kenyaemr_etl.etl_hei_follow_up_visit h
    JOIN openmrs.encounter e ON h.encounter_id = e.encounter_id
    INNER JOIN kenyaemr_etl.etl_mch_postnatal_visit a ON a.encounter_id = e.encounter_id
    INNER JOIN openmrs.patient_appointment p on (p.uuid = e.uuid)
    WHERE
        DATE(a.appointment_date) >= DATE('2022-11-08')
            AND h.encounter_id = a.encounter_id
    GROUP BY h.patient_id) AS t;

-- relate mothers postnatal appointment to babys
create table kenyaemr_etl.appointment_phase_three_dump(
SELECT 
    t.related_appointment_id AS mother_related_appointment_id,
    t.patient_appointment_id AS mother_patient_appointment_id,
    p.patient_appointment_id AS baby_patient_appointment_id,
    p.start_date_time AS baby_date,
    p.related_appointment_id AS baby_related,
    p.patient_id,
    p.appointment_service_id
FROM
    openmrs.patient_appointment p
        LEFT JOIN
    openmrs.patient_appointment t ON (p.related_appointment_id = t.patient_appointment_id)
WHERE
    p.related_appointment_id = t.patient_appointment_id );
    
UPDATE openmrs.patient_appointment a
INNER JOIN kenyaemr_etl.appointment_phase_three_dump b ON a.patient_appointment_id = b.mother_patient_appointment_id and a.patient_id = b.patient_id
SET a.related_appointment_id = b.baby_patient_appointment_id
where a.appointment_service_id = 5 ;

drop table kenyaemr_etl.appointment_phase_three_dump;
