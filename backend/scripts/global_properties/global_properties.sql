use openmrs;
truncate table kenyaemr_ml_patient_risk_score;
update
    global_property
set
    property_value = '0.005011473'
where
    property = 'kenyaemrml.hts.lowRiskThreshold';

update
    global_property
set
    property_value = '0.02795569'
where
    property = 'kenyaemrml.hts.mediumRiskThreshold';

update
    global_property
set
    property_value = '0.1079255'
where
    property = 'kenyaemrml.hts.highRiskThreshold';

update
    global_property
set
    property_value = '0.01351088'
where
    property = 'kenyaemrml.iit.lowRiskThreshold';

update
    global_property
set
    property_value = '0.03023471'
where
    property = 'kenyaemrml.iit.mediumRiskThreshold';

update
    global_property
set
    property_value = '10.00001'
where
    property = 'kenyaemrml.iit.highRiskThreshold';