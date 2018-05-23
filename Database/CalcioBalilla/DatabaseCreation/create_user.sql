-- Launchs the scripts to create all defined users valid for both environment: PROD and TEST

-- ATTENZIONE: l'UTENTE deve essere comune per entrambi i DB di test e PRODUZIONE
 
\set DB_USERNAME calciobalilla
\set DB_PASSWORD '\'calciobalilla\''
\i ../../DatabaseCommons/DatabaseCreation/user-create_user.sql

