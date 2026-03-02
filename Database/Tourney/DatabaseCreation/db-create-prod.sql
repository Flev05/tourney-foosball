-- Creates the database in that order:
-- 1) creates the users
-- 2) creates the tablespaces data and index for every user
-- 3) creates the database for every user
-- 4) creates the schemas in each database 

-- Da richiamare solo se lanciato per primo e l'utente comune non esiste già
\i create_user.sql

\i create_tablespaces-prod.sql 

\i create_db-prod.sql

\i create_schema-tourney-prod.sql
