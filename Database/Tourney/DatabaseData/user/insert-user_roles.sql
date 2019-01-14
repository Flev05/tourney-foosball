-- Tourney 1.0
-- ==============

-- Definition of the user role relations
insert into user_role values (DEFAULT
	, (select id from USER_TABLE where username='lmartino')
	, (select id from ROLE where name='DEVELOPER')
);
 