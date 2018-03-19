-- Creates the schemas defined in function of the received parameters

CREATE SCHEMA :SCHEMA_NAME AUTHORIZATION :SCHEMA_USER_NAME;
COMMENT ON SCHEMA :SCHEMA_NAME IS 'The main schema for the application ';
ALTER ROLE :SCHEMA_USER_NAME IN DATABASE :DB_NAME SET search_path = :SCHEMA_NAME;

GRANT ALL ON SCHEMA :SCHEMA_NAME TO postgres;
GRANT ALL ON SCHEMA :SCHEMA_NAME TO :DB_USERNAME;
GRANT ALL ON SCHEMA :SCHEMA_NAME TO :SCHEMA_USER_NAME;

grant all on all tables in schema :SCHEMA_NAME to :SCHEMA_USER_NAME;
grant all on all sequences in schema :SCHEMA_NAME to :SCHEMA_USER_NAME;

