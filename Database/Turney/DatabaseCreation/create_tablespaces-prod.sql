-- Table spaces for client Tourney 1.0 DB

\set DB_USERNAME tourney

\set TS_DATA "TourneyData"
\set TS_INDEX "TourneyIndex"

-- UFFICIO
\set TS_DATA_LOCATION  '\'D:/luciano/Deploy/DB/tourney/data\''
\set TS_INDEX_LOCATION '\'D:/luciano/Deploy/DB/tourney/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/tourney/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/tourney/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


