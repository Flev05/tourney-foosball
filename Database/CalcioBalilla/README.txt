# Linee guida per la creazione di un database PostgreSQL in ambiente di test e produzione su server Linux

1) Portarsi sotto la directory:
   Database/CalcioBalilla/DatabaseCreation
   editare il file delle tablespace:

   create_tablespaces.sql

   con il pathname delle direcory nel file system Linux:
   '''/data/calciobalilla/data'''
   '''/data/calciobalilla/index''' 
 
   quindi lanciare il comando senza sudo per creare utenti, tablespace, database e schema sia di test che produzione:
   psql -h 127.0.0.1 -d postgres -U postgres -f db-create-prod.sql

2) Popolare lo schema di test nel seguente modo:
   Portarsi sotto la directory:
   Database/CalcioBalilla/DatabaseStructure/test

   e lanciare il comando:
   psql -h 127.0.0.1 -d calciobalilladb -U postgres -f execute4test.sql

3) Popolare lo schema di prod nel seguente modo:
   Portarsi sotto la directory:
   Database/CalcioBalilla/DatabaseStructure/prod

   e lanciare il comando:
   psql -h 127.0.0.1 -d calciobalilladb -U postgres -f execute4prod.sql
