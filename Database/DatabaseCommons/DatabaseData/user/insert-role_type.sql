-- Calcio Balilla 1.0
-- ==============

DELETE FROM ROLE_TYPE;

-- DEVELOPER roles definition
insert into ROLE_TYPE values (DEFAULT, 'DEVELOPER', 'Ruolo per gli utenti Fornitori del sistema');

-- DEMO roles definition
insert into ROLE_TYPE values (DEFAULT, 'DEMO', 		'Ruolo DEMO per far provare il sistema');

-- ADMIN roles definition
insert into ROLE_TYPE values (DEFAULT, 'OWNER', 	'Ruolo per gli utenti proprietari del sistema');
insert into ROLE_TYPE values (DEFAULT, 'ADMIN', 	'Ruolo per gli utenti amministratori di sistema');
insert into ROLE_TYPE values (DEFAULT, 'DRIVER', 	'Ruolo per gli utenti autisti');
insert into ROLE_TYPE values (DEFAULT, 'OPERATOR', 	'Ruolo per gli utenti operatori');

-- Application roles definition
insert into ROLE_TYPE values (DEFAULT, 'AGENCY', 	'Ruolo per gli utenti di tipo agenzia');
insert into ROLE_TYPE values (DEFAULT, 'LINES', 	'Ruolo per gli utenti dei gruppi di linee');
