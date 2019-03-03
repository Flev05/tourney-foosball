-- Tourney 1.0
-- ==============

DELETE FROM discipline;

SELECT pg_catalog.setval('tbl_discipline_id_seq', 1, false);

insert into discipline values (DEFAULT,'Calcio Balilla','Calcio balilla');
insert into discipline values (DEFAULT,'Calcio','Calcio a 11');
insert into discipline values (DEFAULT,'Basket','Palla a canestro');
insert into discipline values (DEFAULT,'Volley','Palla a volo');
insert into discipline values (DEFAULT,'Tennis','tennis');
insert into discipline values (DEFAULT,'Ping Pong','Tennis da tavolo');

