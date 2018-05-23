-- Tourney 1.0
-- ==============

insert into USER_table(id 
, firstname
, lastname
, address
, phone_number
, email
, username
, password
, description
, location_id) 
values(
  DEFAULT
, 'Luciano'
, 'Martino'
, 'Via Nilde Iotti, 8'
, 'luciano.martino@gmail.com'
, '3397858194'
, 'lmartino'
, 'D41D8CD98F00B204E9800998ECF8427E'
, 'Utente sviluppatore del sistema'
, (select id from location where city = 'PREGNANA MILANESE') 