-- Tourney 1.0
-- ==============
-- psql -d tourneydb -U tourney -f execute-prod.sql

\set SCHEMA_USER_NAME tourney;

set search_path to tourney;

\cd ../../DatabaseCommons/DatabaseStructure/user/create

SET default_tablespace = "TourneyData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyIndex";

\i execute-alter.sql

\cd ../../../DatabaseStructure/tourney/create

SET default_tablespace = "TourneyData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyIndex";

\i execute-alter.sql
