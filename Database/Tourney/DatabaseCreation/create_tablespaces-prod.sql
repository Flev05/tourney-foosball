-- Table spaces for client Tourney 1.0 DB

\set DB_USERNAME tourney

\set TS_DATA "TourneyTestData"
\set TS_INDEX "TourneyTestIndex"

-- UFFICIO
-- \set TS_DATA_LOCATION  '\'D:/luciano/EREBUS/DB/tourney/prod/data\''
-- \set TS_INDEX_LOCATION '\'D:/luciano/EREBUS/DB/tourney/prod/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourney/prod/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourney/prod/index\''

-- DESKTOP HP ENVY
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourney/test/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourney/test/index\''

-- Server Centos Linux
-- \set TS_DATA_LOCATION  '\'/data/tourney/tourneydb/data\''
-- \set TS_INDEX_LOCATION '\'/data/tourney/tourneydb/index\''

-- DESKTOP GMKTec
-- \set TS_DATA_LOCATION  '\'C:/DATA/PostgreSQL/tourney/data\''
-- \set TS_INDEX_LOCATION '\'C:/DATA/PostgreSQL/tourney/index\''

-- DESKTOP FISSO Flavio
\set TS_DATA_LOCATION  '\'C:/tablespaces/data\''
\set TS_INDEX_LOCATION '\'C:/tablespaces/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


