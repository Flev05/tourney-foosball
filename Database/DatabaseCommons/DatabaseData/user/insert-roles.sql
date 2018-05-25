-- Tourney 1.0
-- ==============

-- Definition of the user role relations
DELETE FROM ROLE;

--Predefined DEVELOPER role definition
insert into ROLE values (DEFAULT, 'DEVELOPER', 'Ruolo per gli utenti sviluppatori del sistema');

-- Predefined Role DEMO role definition
insert into ROLE values (DEFAULT, 'DEMO', 		'Ruolo DEMO per utenti anonimi per far provare il sistema');

-- Predefined OWNER role definition
insert into ROLE values (DEFAULT, 'OWNER', 	'Ruolo per gli utenti proprietari del sistema');

-- Predefined ADMIN role definition
insert into ROLE values (DEFAULT, 'ADMIN', 	'Ruolo per gli utenti amministratori di sistema');

