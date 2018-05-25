-- Tourney 1.0

insert into client (id
, firstname
, lastname
, business_name
, address
, phone_number
, email
, site_url
, location_id) 
values(
DEFAULT
, 'Luciano'
, 'Martino'
, 'Luciano Martino'
, 'Via Nilde Iotti, 8'
, '3397858194'
, 'luciano.martino@gmail.com'
, 'www.calciobalillapregnana.it'
, (select id from location where city = 'PREGNANA MILANESE') 
);
insert into client (id
, firstname
, lastname
, business_name
, address
, phone_number
, email
, site_url
, location_id) 
values(
DEFAULT
, 'anonym'
, 'anonym'
, 'anonym anonym'
, 'Via anonym, 8'
, '3397858194'
, ''
, ''
, (select id from location where city = 'PREGNANA MILANESE') 
);
