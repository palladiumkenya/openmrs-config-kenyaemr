INSERT INTO
    `cashier_payment_mode`
VALUES
    (
        1,
        'Cash',
        'Cash Payment',
        1,
        '2023-12-06 13:07:32',
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        '63eff7a4-6f82-43c4-a333-dbcc58fe9f74',
        NULL
    ),
    (
        2,
        'Insurance',
        'Insurance method of payment',
        1,
        '2023-12-06 13:07:34',
        1,
        '2023-12-07 11:34:08',
        0,
        NULL,
        NULL,
        NULL,
        'beac329b-f1dc-4a33-9e7c-d95821a137a6',
        NULL
    ),
    (
        5,
        'Mobile Money',
        'Mobile money method of payment',
        1,
        '2023-12-07 11:32:10',
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        '28989582-e8c3-46b0-96d0-c249cb06d5c6',
        NULL
    ),
    (
        7,
        'Waiver',
        'Waiver payment',
        1,
        '2024-01-19 09:10:11',
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        'eb6173cb-9678-4614-bbe1-0ccf7ed9d1d4',
        NULL
    );

INSERT INTO
    `cashier_payment_mode_attribute_type`
VALUES
    (
        1,
        5,
        0,
        'Reference Number',
        'Reference Number',
        NULL,
        'java.lang.String',
        NULL,
        0,
        1,
        '2023-12-08 12:06:58',
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        'd453e528-0264-4d6e-ae23-bc0b777e1146'
    );

INSERT INTO
    `cashier_cash_point`
VALUES
    (
        1,
        'OPD Cash Point',
        '',
        1,
        '2023-12-06 12:46:19',
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        '54065383-b4d4-42d2-af4d-d250a1fd2590',
        7860
    );

delete from
    global_property
where
    property = 'kenyaemr.cashier.systemReceiptNumberGenerator';

delete from
    global_property
where
    property = 'openhmis.cashier.systemReceiptNumberGenerator';

insert into
    global_property (property, property_value, description, uuid)
values
    (
        'openhmis.cashier.systemReceiptNumberGenerator',
        'org.openmrs.module.kenyaemr.cashier.api.SequentialReceiptNumberGenerator',
        'Fully qualified class name of the receipt number generator to be used.',
        '4fdfdc37-656e-41f9-80ba-4d8e70ffe3f7'
    ),
    (
        'kenyaemr.cashier.systemReceiptNumberGenerator',
        'org.openmrs.module.kenyaemr.cashier.api.SequentialReceiptNumberGenerator',
        'Fully qualified class name of the receipt number generator to be used.',
        '6d24eb6e-b42f-4706-ab2d-ae4472161f6a'
    );