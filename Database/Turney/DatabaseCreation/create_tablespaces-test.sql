-- Table spaces for client  Tourney 1.0 DB

\set DB_USERNAME tourney

\set TS_DATA "TourneyTestData"
\set TS_INDEX "TourneyTestIndex"

-- UFFICIO
\set TS_DATA_LOCATION  '\'D:/luciano/Deploy/DB/tourney/test/data\''
\set TS_INDEX_LOCATION '\'D:/luciano/Deploy/DB/tourney/test/index\''

-- DESKTOP HP
-- \set TS_DATA_LOCATION  '\'C:/DATA/TOOLS/DB/TableSpaces/tourneytest/data\''
-- \set TS_INDEX_LOCATION '\'C:/DATA/TOOLS/DB/TableSpaces/tourneytest/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourneytest/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourneytest/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


