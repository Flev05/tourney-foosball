-- Tourney 1.0
-- ==============

DELETE FROM user_role_client;

-- Definition of the user role client relations
insert into user_role_client(id, user_id, role_id, client_id)
values (DEFAULT
	, (select id from USER_TABLE where username='lmartino')
	, (select id from ROLE where name='DEVELOPER')
	, (select id from CLIENT where email='luciano.martino@gmail.com')
);
 