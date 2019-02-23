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
, country_id) 
values(
  DEFAULT
, 'Luciano'
, 'Martino'
, 'Via Nilde Iotti, 8'
, '3397858194'
, 'luciano.martino@gmail.com'
, 'lmartino'
, 'D20B282FEE15FFFE2BACAE246857D3DC'
, 'Utente sviluppatore del sistema'
, (select id from country where city = 'PREGNANA MILANESE') 
);
