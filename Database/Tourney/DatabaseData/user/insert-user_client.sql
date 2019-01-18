-- Tourney 1.0
-- ==============

-- Definition of the user role relations
insert into user_client(id, user_id, client_id) values (DEFAULT
	, (select id from USER_TABLE where username='lmartino')
	, (select id from CLIENT where email='luciano.martino@gmail.com')
);
 