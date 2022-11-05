USE oak;

INSERT INTO object (parent, name, is_file)
VALUES ('/insurance', 'dev.insurance.com', TRUE),
       ('/insurance', 'stg.insurance.com', TRUE),
       ('/insurance', 'prd.insurance.com', TRUE),
       ('/drug', 'dev.drug.com', TRUE),
       ('/drug', 'stg.drug.com', TRUE),
       ('/drug', 'prd.drug.com', TRUE),
       ('/facility', 'dev.facility.com', TRUE),
       ('/facility', 'stg.facility.com', TRUE),
       ('/facility', 'prd.facility.com', TRUE),
       ('/prescriber', 'dev.prescriber.com', TRUE),
       ('/prescriber', 'stg.prescriber.com', TRUE),
       ('/prescriber', 'prd.prescriber.com', TRUE),
       ('/insurance/claim-format', 'dev.claim-format.com', TRUE),
       ('/insurance/claim-format', 'stg.claim-format.com', TRUE),
       ('/insurance/claim-format', 'prd.claim-format.com', TRUE),
       ('/insurance/claim-parameter', 'dev.claim-parameter.com', TRUE),
       ('/insurance/claim-parameter', 'stg.claim-parameter.com', TRUE),
       ('/insurance/claim-parameter', 'prd.claim-parameter.com', TRUE);

INSERT INTO file (content, version, is_committed)
VALUES ('{ "host": "dev.insurance.com" }', 1, TRUE),
       ('{ "host": "stg.insurance.com" }', 1, TRUE),
       ('{ "host": "prd.insurance.com" }', 1, TRUE),
       ('{ "host": "dev.drug.com" }', 1, TRUE),
       ('{ "host": "stg.drug.com" }', 1, TRUE),
       ('{ "host": "prd.drug.com" }', 1, TRUE),
       ('{ "host": "dev.facility.com" }', 1, TRUE),
       ('{ "host": "stg.facility.com" }', 1, TRUE),
       ('{ "host": "prd.facility.com" }', 1, TRUE),
       ('{ "host": "dev.prescriber.com" }', 1, TRUE),
       ('{ "host": "stg.prescriber.com" }', 1, TRUE),
       ('{ "host": "prd.prescriber.com" }', 1, TRUE),
       ('{ "host": "dev.claim-format.com" }', 1, TRUE),
       ('{ "host": "stg.claim-format.com" }', 1, TRUE),
       ('{ "host": "prd.claim-format.com" }', 1, TRUE),
       ('{ "host": "dev.claim-parameter.com" }', 1, TRUE),
       ('{ "host": "stg.claim-parameter.com" }', 1, TRUE),
       ('{ "host": "prd.claim-parameter.com" }', 1, TRUE);

INSERT INTO object_file (object_id, file_id)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5),
       (6, 6),
       (7, 7),
       (8, 8),
       (9, 9),
       (10, 10),
       (11, 11),
       (12, 12),
       (13, 13),
       (14, 14),
       (15, 15),
       (16, 16),
       (17, 17),
       (18, 18);

INSERT INTO object (parent, name, is_file)
VALUES ('', '/', FALSE);

INSERT INTO object (parent, name, is_file)
VALUES ('/', 'insurance', FALSE),
       ('/', 'drug', FALSE),
       ('/', 'facility', FALSE),
       ('/', 'prescriber', FALSE);

INSERT INTO object (parent, name, is_file)
VALUES ('/insurance', 'claim-format', FALSE),
       ('/insurance', 'claim-parameter', FALSE);
