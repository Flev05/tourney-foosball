-- Unique file to create everythinks: user, tablespace and database
-- Run form command line as:
-- psql [-h 127.0.0.1] -d postgres -U postgres -f create-tourney-db-test.sql
-- Set the correct below variables to the correct DB you would like to create
-- BEGIN VARIABLE SECTION
\set TS_DATA "TourneyData"
\set TS_INDEX "TourneyIndex"

-- Linux version
\set TS_DATA_LOCATION  '\'/data/tourney/tourneydb/data\''
\set TS_INDEX_LOCATION '\'/data/tourney/tourneydb/index\''

-- Windows version
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourneydb/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourneydb/index\''

\set DEFAULT_TS "TourneyData"
\set DB_NAME tourneydb
-- END VARIABLE SECTION

-- BEGIN NOT VARIABLE SECTION
\set DB_USERNAME tourney
\set DB_PASSWORD '\'tourney\''
\set SCHEMA_NAME tourney
\set SCHEMA_USER_NAME tourney
-- END NOT VARIABLE SECTION

CREATE ROLE :DB_USERNAME LOGIN
        PASSWORD :DB_PASSWORD
        NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE;

CREATE TABLESPACE :TS_DATA
        OWNER :DB_USERNAME
        LOCATION :TS_DATA_LOCATION;

CREATE TABLESPACE :TS_INDEX
        OWNER :DB_USERNAME
        LOCATION :TS_INDEX_LOCATION;

-- \connect :DB_NAME
CREATE DATABASE :DB_NAME
        WITH OWNER = :DB_USERNAME
        ENCODING = 'UTF8'
        TABLESPACE = :DEFAULT_TS
        CONNECTION LIMIT = -1;

CREATE SCHEMA :SCHEMA_NAME AUTHORIZATION :SCHEMA_USER_NAME;
COMMENT ON SCHEMA :SCHEMA_NAME IS 'The main schema for the application ';
ALTER ROLE :SCHEMA_USER_NAME IN DATABASE :DB_NAME SET search_path = :SCHEMA_NAME;

GRANT ALL ON SCHEMA :SCHEMA_NAME TO postgres;
GRANT ALL ON SCHEMA :SCHEMA_NAME TO :DB_USERNAME;
GRANT ALL ON SCHEMA :SCHEMA_NAME TO :SCHEMA_USER_NAME;

grant all on all tables in schema :SCHEMA_NAME to :SCHEMA_USER_NAME;
grant all on all sequences in schema :SCHEMA_NAME to :SCHEMA_USER_NAME;

