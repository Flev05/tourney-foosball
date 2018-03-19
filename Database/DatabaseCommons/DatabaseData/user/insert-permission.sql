-- Calcio Balilla 1.0
-- ==============

SELECT pg_catalog.setval('permission_id_seq', 1, false);

-- role DEVELOPER
insert into permission values (DEFAULT
	, 'RW'
	, (select rt.id from ROLE_TYPE as rt where rt.name='DEVELOPER')
	, (select id from RESOURCE where name='accordion.console')
);
 
 
