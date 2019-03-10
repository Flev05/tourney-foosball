-- Tourney 1.0

DELETE FROM client;

insert into client (id
, business_name
, address
, phone_number
, email
, site_url
, country_id) 
values(
DEFAULT
, 'Cliente Developer'
, 'Via Nilde Iotti, 8'
, '+39 339 78 58 194'
, 'luciano.martino@gmail.com'
, 'www.erebus-soft.it'
, (select id from country where city = 'PREGNANA MILANESE') 
);
