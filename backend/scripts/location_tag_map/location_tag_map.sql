INSERT INTO location_tag_map ( location_id, location_tag_id ) 
VALUES
((select property_value from global_property where property='kenyaemr.defaultLocation'), (select location_tag_id from location_tag where name='Login Location')),
((select property_value from global_property where property='kenyaemr.defaultLocation'), (select location_tag_id from location_tag where name='Appointment Location')),
((select location_id from location where name='CCC'), (select location_tag_id from location_tag where name='Queue Location')),
((select location_id from location where name='MCH'), (select location_tag_id from location_tag where name='Queue Location')),
((select location_id from location where name='Laboratory'), (select location_tag_id from location_tag where name='Queue Location')),
((select location_id from location where name='Pharmacy'), (select location_tag_id from location_tag where name='Queue Location')),
((select location_id from location where name='HTS'), (select location_tag_id from location_tag where name='Queue Location'));
