-- Tourney 1.0

insert into client (id
, firstname
, lastname
, business_name
, address
, phone_number
, email
, site_url
, country_id) 
values(
DEFAULT
, 'Luciano'
, 'Martino'
, 'Luciano Martino'
, 'Via Nilde Iotti, 8'
, '3397858194'
, 'luciano.martino@gmail.com'
, 'www.calciobalillapregnana.it'
, (select id from country where city = 'PREGNANA MILANESE') 
);
