-- EREBUS 3.0
-- ==============
-- psql -d calciobalilladbtest -U calciobalilla -f execute-test.sql

\set SCHEMA_USER_NAME calciobalilla;

set search_path to calciobalilla;

\cd ../../DatabaseCommons/DatabaseStructure/user/create

SET default_tablespace = "CalcioBalillaTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "CalcioBalillaTestIndex";

\i execute-alter.sql

\cd ../../../DatabaseStructure/calciobalilla/create

SET default_tablespace = "CalcioBalillaTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "CalcioBalillaTestIndex";

\i execute-alter.sql
