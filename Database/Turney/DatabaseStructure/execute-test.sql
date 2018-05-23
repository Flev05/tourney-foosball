-- Tourney 1.0
-- ==============
-- psql -d tourneydbtest -U tourney -f execute-test.sql

\set SCHEMA_USER_NAME tourney;

set search_path to tourney;

\cd ../../DatabaseCommons/DatabaseStructure/user/create

SET default_tablespace = "TourneyTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyTestIndex";

\i execute-alter.sql

\cd ../../../DatabaseStructure/tourney/create

SET default_tablespace = "TourneyTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyTestIndex";

\i execute-alter.sql
