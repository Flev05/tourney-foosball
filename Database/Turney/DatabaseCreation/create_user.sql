-- Launchs the scripts to create all defined users valid for both environment: PROD and TEST

-- ATTENZIONE: l'UTENTE deve essere comune per entrambi i DB di test e PRODUZIONE
 
\set DB_USERNAME tourney
\set DB_PASSWORD '\'tourney\''
\i ../../DatabaseCommons/DatabaseCreation/user-create_user.sql

