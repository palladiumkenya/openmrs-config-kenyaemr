INSERT INTO
    `openmrs`.`stockmgmt_stock_source` (
        `stock_source_id`,
        `name`,
        `acronym`,
        `source_type_id`,
        `creator`,
        `date_created`,
        `changed_by`,
        `date_changed`,
        `voided`,
        `voided_by`,
        `date_voided`,
        `void_reason`,
        `uuid`
    )
VALUES
    (
        '1',
        'KEMSA',
        'KMS',
        '1000586',
        '1',
        '2024-02-06 00:00:00',
        NULL,
        NULL,
        '0',
        NULL,
        NULL,
        NULL,
        '60c28484-75ad-439f-b10a-04e7bf28b0a9'
    );

INSERT INTO `openmrs`.`stockmgmt_user_role_scope` (`user_role_scope_id`, `user_id`, `role`, `is_permanent`, `active_from`, `active_to`, `enabled`, `creator`, `date_created`, `changed_by`, `date_changed`, `voided`, `voided_by`, `date_voided`, `void_reason`, `uuid`) VALUES ('1', '1', 'Inventory Manager', '1', NULL, NULL, '1', '1', '2024-02-06 00:00:00', NULL, NULL, '0', NULL, NULL, NULL, '4e20b4ce-d457-4a30-adcf-1ec988d3e6be');