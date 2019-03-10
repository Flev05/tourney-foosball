-- Tourney 1.0
-- ==============
-- psql -h 127.0.0.1 -d tourneydbtest -U tourney -f execute-test.sql

\set SCHEMA_USER_NAME tourney;

set search_path to tourney;

\cd ./user/create

SET default_tablespace = "TourneyTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyTestIndex";

\i execute-alter.sql

\cd ../../tourney/create

SET default_tablespace = "TourneyTestData";

\i execute-create.sql

\cd ../alter

SET default_tablespace = "TourneyTestIndex";

\i execute-alter.sql
