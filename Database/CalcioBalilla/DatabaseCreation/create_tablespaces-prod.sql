-- Table spaces for client CALCIO BALILLA DB

\set DB_USERNAME calciobalilla

\set TS_DATA "CalcioBalillaData"
\set TS_INDEX "CalcioBalillaIndex"

-- UFFICIO
\set TS_DATA_LOCATION  '\'D:/luciano/Deploy/DB/calciobalilla/data\''
\set TS_INDEX_LOCATION '\'D:/luciano/Deploy/DB/calciobalilla/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/calciobalilla/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/calciobalilla/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


