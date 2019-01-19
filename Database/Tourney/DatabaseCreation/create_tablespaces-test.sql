-- Table spaces for client  Tourney 1.0 DB

\set DB_USERNAME tourney

\set TS_DATA "TourneyTestData"
\set TS_INDEX "TourneyTestIndex"

-- UFFICIO
-- \set TS_DATA_LOCATION  '\'D:/luciano/EREBUS/DB/tourney/test/data\''
-- \set TS_INDEX_LOCATION '\'D:/luciano/EREBUS/DB/tourney/test/index\''

-- DESKTOP HP
\set TS_DATA_LOCATION  '\'C:/DATA/TOOLS/DB/TableSpaces/tourney/test/data\''
\set TS_INDEX_LOCATION '\'C:/DATA/TOOLS/DB/TableSpaces/tourney/test/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourney/test/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourney/test/index\''

-- Server Centos Linux
-- \set TS_DATA_LOCATION  '\'/data/tablespaces/tourney/test/data\''
-- \set TS_INDEX_LOCATION '\'/data/tablespaces/tourney/test/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


