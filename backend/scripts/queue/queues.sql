INSERT INTO queue VALUES 
(1,'Triage service','Triage service', (select property_value from global_property where property='kenyaemr.defaultLocation'), '167411', 1, '2022-11-08 10:00:13',NULL,NULL,0,NULL,NULL,NULL,'12b959a2-7b10-4df7-80c0-cd623bfbbcff'),
(2,'Clinical consultation', 'Clinical consultation', (select property_value from global_property where property='kenyaemr.defaultLocation'),'167410', 1,'2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'b7b405a0-22d2-4bcc-8d98-098dd87269a7'),
(3,'Lab service', 'Lab service', (select property_value from global_property where property='kenyaemr.defaultLocation'),'900007', 1, '2022-11-08 10:00:13', NULL, NULL,0,NULL,NULL,NULL,'d8867fd2-5ec9-490c-bb1d-162faf8c3036'),
(4,'Nutrition service','Nutrition service', (select property_value from global_property where property='kenyaemr.defaultLocation'),'900009', 1,'2022-11-08 10:00:13', NULL, NULL, 0,NULL,NULL,NULL,'ab4da7a2-9aad-4e1a-ba63-9e52929c90a5'),
(5,'Pharmacy service', 'Pharmacy',(select property_value from global_property where property='kenyaemr.defaultLocation'),'900008', 1, '2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'f606ce62-da7f-4e81-9e76-52e21b0f7b44'),
(6,'Adherence counselling service','Adherence counselling service',(select property_value from global_property where property='kenyaemr.defaultLocation'), '900010', 1,'2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'a693d563-e6e8-49ed-94dd-884ce559587b'),
(7,'Peer educator service','Peer educator service', (select property_value from global_property where property='kenyaemr.defaultLocation'),'900011', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'af0ecd9a-8f1b-4632-ae14-73a9dd40611f'),
(8,'Triage service','Triage service', (select location_id from location where name='CCC'), '167411', 1, '2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'b47f1e37-9531-467e-ba85-74acbd0c462c'),
(9,'Clinical consultation', 'Clinical consultation', (select location_id from location where name='CCC'),'167410', 1,'2022-11-08 10:00:13',NULL, NULL, 0,NULL,NULL,NULL,'dc9232d2-c28d-4605-932a-5eb67832f748'),
(10,'Lab service', 'Lab service', (select location_id from location where name='CCC'),'900007', 1, '2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'2a576518-375e-4679-bbe5-192ba22851b3'),
(11,'Nutrition service','Nutrition service', (select location_id from location where name='CCC'),'900009', 1,'2022-11-08 10:00:13', NULL,NULL, 0,NULL,NULL,NULL,'6b8e31e5-84a2-4345-bfd5-c9113fb3933c'),
(12,'Pharmacy service', 'Pharmacy',(select location_id from location where name='CCC'),'900008', 1, '2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'34b58b4a-1280-47c6-ae41-e5c90029070f'),
(13,'Adherence counselling service','Adherence counselling service',(select location_id from location where name='CCC'), '900010', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'d62c017f-97f8-44fa-955d-4110f688ce36'),
(14,'Peer educator service','Peer educator service', (select location_id from location where name='CCC'),'900011', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'a8908458-b50c-4d72-97bf-30341a4f9727'),
(15,'Triage service','Triage service', (select location_id from location where name='MCH'), '167411', 1, '2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'83750deb-8414-4b2c-abb0-637f275a3a01'),
(16,'Clinical consultation', 'Clinical consultation', (select location_id from location where name='MCH'),'167410', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'b56cd2d2-b832-4de2-ae73-36aed367838a'),
(17,'Lab service', 'Lab service', (select location_id from location where name='MCH'),'900007', 1, '2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'f2058006-94b2-451c-bc4e-cc3e7f223675'),
(18,'Nutrition service','Nutrition service', (select location_id from location where name='MCH'),'900009', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'c7aa5da3-7c41-422e-b9f8-05c49cb5b5b7'),
(19,'Pharmacy service', 'Pharmacy',(select location_id from location where name='MCH'),'900008', 1, '2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'20bddf7e-fe31-455b-a51c-93ae1ac32c98'),
(20,'Adherence counselling service','Adherence counselling service',(select location_id from location where name='MCH'), '900010', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'3cf70532-16b4-41ad-a947-c84243824d37'),
(21,'Peer educator service','Peer educator service', (select location_id from location where name='MCH'),'900011', 1,'2022-11-08 10:00:13', NULL,NULL,0,NULL,NULL,NULL,'c3a9fea2-8ea0-4f8e-810a-1647218fed9d');
