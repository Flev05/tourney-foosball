-- Creates all the defined schemas in the DB

\set DB_NAME tourneydb
\connect :DB_NAME
 
\set SCHEMA_NAME tourney
\set SCHEMA_USER_NAME tourney
\set DB_USERNAME tourney

\i ../../DatabaseCommons/DatabaseCreation/schema-create_schema.sql
 