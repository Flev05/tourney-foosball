-- Tourney 1.0
-- ==============

DELETE FROM ROLE_TYPE;

-- DEVELOPER roles definition
insert into ROLE_TYPE values (DEFAULT, 'DEVELOPER', 'Ruolo per gli utenti Fornitori del sistema');

-- ADMIN roles definition
insert into ROLE_TYPE values (DEFAULT, 'OWNER', 	'Ruolo per gli utenti proprietari del sistema');
insert into ROLE_TYPE values (DEFAULT, 'ADMIN', 	'Ruolo per gli utenti amministratori di sistema');

-- DEMO roles definition
insert into ROLE_TYPE values (DEFAULT, 'DEMO', 		'Ruolo DEMO per far provare il sistema');
