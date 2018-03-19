-- Creates all the defined schemas in the DB

\set DB_NAME calciobalilladb
\connect :DB_NAME
 
\set SCHEMA_NAME calciobalilla
\set SCHEMA_USER_NAME calciobalilla
\set DB_USERNAME calciobalilla

\i ../../DatabaseCommons/DatabaseCreation/schema-create_schema.sql
 