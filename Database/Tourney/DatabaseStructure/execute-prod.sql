-- Tourney 1.0
-- ==============
-- psql -h 127.0.0.1 -d tourneydb -U tourney -f execute-prod.sql

\set SCHEMA_USER_NAME tourney;

set search_path to tourney;

\cd ./user/create

SET default_tablespace = "TourneyData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyIndex";

\i execute-alter.sql

\cd ./tourney/create

SET default_tablespace = "TourneyData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyIndex";

\i execute-alter.sql
