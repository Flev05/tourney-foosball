# AMBIENTE DI TEST
# Linee guida per la creazione di un database PostgreSQL in ambiente di test su server Linux

1) Portarsi sotto la directory:
   Database/Tourney/DatabaseCreation
   editare il file delle tablespace:

   create_tablespaces-test.sql

   con il pathname delle direcory nel file system Linux:
	'\'/data/tablespaces/tourney/test/data\''
	'\'/data/tablespaces/tourney/test/index\''

   quindi lanciare il comando (senza sudo) per creare utenti, tablespace, database e schema di test:
   psql -h 127.0.0.1 -d postgres -U postgres -f db-create-test.sql

2) Popolare lo schema di TEST nel seguente modo:
   Portarsi sotto la directory:
   Database/Tourney/DatabaseStructure

   e lanciare il comando:
   psql -h 127.0.0.1 -d tourneydbtest -U postgres -f execute-test.sql

3) Popolare lo schema di TEST nel seguente modo:
   Portarsi sotto la directory:
   Database/Tourney/DatabaseData

   e lanciare il comando:
   psql -h 127.0.0.1 -d tourneydbtest -U tourney -f insert-all.sql

# AMBIENTE DI PRODUZIONE
# Linee guida per la creazione di un database PostgreSQL in ambiente di produzione su server Linux
   
1) Portarsi sotto la directory:
   Database/Tourney/DatabaseCreation
   editare il file delle tablespace:

   create_tablespaces-prod.sql

   con il pathname delle direcory nel file system Linux:
	'\'/data/tablespaces/tourney/prod/data\''
	'\'/data/tablespaces/tourney/prod/index\''

   quindi lanciare il comando (senza sudo) per creare utenti, tablespace, database e schema di produzione:
   psql -h 127.0.0.1 -d postgres -U postgres -f db-create-prod.sql

2) Popolare lo schema di PRODUZIONE nel seguente modo:
   Portarsi sotto la directory:
   Database/Tourney/DatabaseStructure

   e lanciare il comando:
   psql -h 127.0.0.1 -d tourneydb -U tourney -f execute-prod.sql

3) Popolare lo schema di TEST nel seguente modo:
   Portarsi sotto la directory:
   Database/Tourney/DatabaseData/user

   e lanciare il comando:
   psql -h 127.0.0.1 -d tourneydb -U tourney -f insert-all.sql

   