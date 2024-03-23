#il module configs
update
    global_property
set
    property_value = 'echis.partner.client'
where
    property = 'kenyaemril.fhir.server.oath2.client.id';

update
    global_property
set
    property_value = '9d82f439'
where
    property = 'kenyaemril.fhir.server.oath2.client.secret';

update
    global_property
set
    property_value = 'DHP.Gateway DHP.Partners'
where
    property = 'kenyaemril.fhir.server.oath2.scope';

update
    global_property
set
    property_value = 'https://fhir.health.go.ke/fhir-server/api/v4/'
where
    property = 'kenyaemril.fhir.server.url';

update
    global_property
set
    property_value = 'https://afyakenyaidentityapi.health.go.ke/connect/token'
where
    property = 'kenyaemril.fhir.server.token.url';

update
    global_property
set
    property_value = '8a845a89-6aa5-4111-81d3-0af31c45c002'
where
    property = 'interop.mflcode.locationAttributeTypeUuid';

update
    global_property
set
    property_value = 'f85081e2-b4be-4e48-b3a4-7994b69bb101'
where
    property = 'interop.nupi.patientIdentifierTypeUuid';

update
    global_property
set
    property_value = 'true'
where
    property = 'locationAttributeTypeUuidinterop.enableOpenHIM';

update
    global_property
set
    property_value = 'https://openhimapi.kenyahmis.org/rest/api'
where
    property = 'interop.openhimBaseURL';

update
    global_property
set
    property_value = '/fhir/v4'
where
    property = 'interop.openhimBaseURLSuffix';

update
    global_property
set
    property_value = 'f5bac3ff-4d10-4e20-9f00-72f7ab9ebe44'
where
    property = 'interop.practitionerAttributeTypeUuid';

update
    global_property
set
    property_value = 'echis.partner.client'
where
    property = 'interop.shr.oauth2.client.id';

update
    global_property
set
    property_value = '9d82f439'
where
    property = 'interop.shr.oauth2.client.secret';

update
    global_property
set
    property_value = 'DHP.Gateway DHP.Partners'
where
    property = 'interop.shr.oauth2.scope';

update
    global_property
set
    property_value = 'https://afyakenyaidentityapi.health.go.ke/connect/token'
where
    property = 'interop.shr.token.url';

update
    global_property
set
    property_value = 'https://fhir.health.go.ke/fhir-server/api/v4/'
where
    property = 'interop.system.url.configuration';

update
    global_property
set
    property_value = 'https://api.kmhfl.health.go.ke/api/'
where
    property = 'interop.kmhfl.system.url.configuration';

update
    global_property
set
    property_value = 'https://afyakenyaapi.health.go.ke/partners/registry/search/upi/'
where
    property = 'interop.cr.system.url.configuration';