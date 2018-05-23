-- Table spaces for client CALCIO BALILLA DB

\set DB_USERNAME calciobalilla

\set TS_DATA "CalcioBalillaTestData"
\set TS_INDEX "CalcioBalillaTestIndex"

-- UFFICIO
-- \set TS_DATA_LOCATION  '\'D:/luciano/Deploy/DB/calciobalillatest/data\''
-- \set TS_INDEX_LOCATION '\'D:/luciano/Deploy/DB/calciobalillatest/index\''

-- DESKTOP HP
\set TS_DATA_LOCATION  '\'C:/DATA/TOOLS/DB/TableSpaces/calciobalillatest/data\''
\set TS_INDEX_LOCATION '\'C:/DATA/TOOLS/DB/TableSpaces/calciobalillatest/index\''

-- LAPTOP LENOVO
-- \set TS_DATA_LOCATION  '\'C:/views/tablespaces/calciobalillatest/data\''
-- \set TS_INDEX_LOCATION '\'C:/views/tablespaces/calciobalillatest/index\''

\i ../../DatabaseCommons/DatabaseCreation/create_tablespaces.sql


