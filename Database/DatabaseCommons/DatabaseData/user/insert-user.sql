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
, client_id
, location_id) 
values(
  DEFAULT
, 'Luciano'
, 'Martino'
, 'Via Nilde Iotti, 8'
, 'luciano.martino@gmail.com'
, '3397858194'
, 'lmartino'
, 'D20B282FEE15FFFE2BACAE246857D3DC'
, 'Utente sviluppatore del sistema'
, (select id from client where firstname= 'Luciano' and lastname='Martino') 
, (select id from location where city = 'PREGNANA MILANESE') 
);

insert into USER_table(id 
, firstname
, lastname
, address
, phone_number
, email
, username
, password
, description
, client_id
, location_id) 
values(
  DEFAULT
, 'demo'
, 'demo'
, 'Via demo, 8'
, 'luciano.martino@gmail.com'
, '3397858194'
, 'demo'
, 'D20B282FEE15FFFE2BACAE246857D3DC'
, 'Utente anonimo'
, (select id from client where firstname= 'anonym' and lastname='anonym') 
, (select id from location where city = 'PREGNANA MILANESE') 
);
