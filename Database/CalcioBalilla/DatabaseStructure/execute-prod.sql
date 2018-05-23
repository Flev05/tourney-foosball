-- EREBUS 3.0
-- ==============
-- psql -d calciobalilladb -U calciobalilla -f execute-prod.sql

\set SCHEMA_USER_NAME calciobalilla;

set search_path to calciobalilla;

\cd ../../DatabaseCommons/DatabaseStructure/user/create

SET default_tablespace = "CalcioBalillaData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "CalcioBalillaIndex";

\i execute-alter.sql

\cd ../../../DatabaseStructure/calciobalilla/create

SET default_tablespace = "CalcioBalillaData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "CalcioBalillaIndex";

\i execute-alter.sql
