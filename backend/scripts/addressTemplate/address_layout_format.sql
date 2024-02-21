INSERT INTO
  global_property (
    `property`,
    `property_value`,
    `description`,
    `uuid`,
    `datatype`,
    `datatype_config`,
    `preferred_handler`,
    `handler_config`,
    `date_changed`,
    `changed_by`
  )
VALUES
  (
    'layout.address.format',
    '<org.openmrs.layout.address.AddressTemplate>\r\n  <nameMappings>\r\n    <entry>\r\n      <string>countyDistrict</string>\r\n      <string>County</string>\r\n      <requiredInHierarchy>true</requiredInHierarchy>\r\n    </entry>\r\n    <entry>\r\n      <string>stateProvince</string>\r\n      <string>Sub County</string>\r\n    </entry>\r\n    <entry>\r\n      <string>address4</string>\r\n      <string>Ward</string>\r\n    </entry>\r\n  </nameMappings>\r\n  <sizeMappings>\r\n    <entry>\r\n      <string>countyDistrict</string>\r\n      <string>40</string>\r\n    </entry>\r\n    <entry>\r\n      <string>stateProvince</string>\r\n      <string>40</string>\r\n    </entry>\r\n    <entry>\r\n      <string>address4</string>\r\n      <string>40</string>\r\n    </entry>\r\n  </sizeMappings>\r\n  <elementDefaults>\r\n    <entry>\r\n      <string>countyDistrict</string>\r\n      <string></string>\r\n    </entry>\r\n  </elementDefaults>\r\n  <requiredElements>\r\n     <string>countyDistrict</string>\r\n     <string>stateProvince</string>\r\n     <string>address4</string>\r\n  </requiredElements>\r\n  <lineByLineFormat>\r\n    <string>address4</string>\r\n    <string>countyDistrict, stateProvince</string>\r\n  </lineByLineFormat>\r\n  <maxTokens>0</maxTokens>\r\n</org.openmrs.layout.address.AddressTemplate>',
    NULL,
    'a84ffe4f-6333-4e0e-9245-1618239094b7',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );