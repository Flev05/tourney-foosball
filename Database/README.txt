Di seguito sono riportate le linee guida per l'installazione o upgrade dell'applicazione ERP-ERP.

PRECONDIZIONI PER LA PRIMA INSTALLAZIONE
Verificare che siano soddisfatte le seguenti precondizioni:
- deve già essere installata e disponibile una JVM (Java Virtual Machine)
- deve essere già installata e una istanza di TomCat
- deve essere già installata e raggiungibile una istanza di PostgreSQL
- devono essere create entrambe le table space DATA e INDEX per ERP
- Su macchine LINUX entrambe le table space (compreso tutto il path) devono essere di proprietà dell'utente postgres

Reiterare il ciclo finchè tali precondizioni non siano state tutte soddisfatte. 

In particolare deve funzionare da shell il seguente comando:

$ psql -h <postgresHost> -d postgres -U postgres 

Dove <postgresHost> è l'indirizzo logico o IP del server dove è installato POSTGRES.

Quando tutte le precondizioni sono soddisfatte espandere il file di release ERP-ERP-*.zip in un folder di comodo.

Nel folder espanso ci sono sia i dati di release veri e proprio che gli script di installazione.

Esistono due procedure di installazione nel folder scripts:
- una per ambiente Windows
- una per ambiente Linux
contenute rispettivamente nei folder: 
- windows
- linux

Le procedure risolvono due use case:
- Lo use case di prima installazione: eseguita dallo script install-erp.cmd/sh sotto
- Lo use case di upgrade: eseguita dallo script upgrade-erp.cmd/sh

Entrambi gli script fanno capo ad un file di configurazione dell'installazione/upgrade denominato:
- install.conf
Tale file deve essere compilato con i dati di configurazione per:
- il DB
- l'application server
- l'applicazione ERP 

Nello use case di prima installazione sono da impostare correttamente tutti i parametri autoesplicativi del file install.conf, 
in particolare i parametri:
- OLD_VERSION
- NEW_VERSION
devono essere uguali e hanno il valore della release che viene installata. 
Es: se si installa ERP-1.12.33, entrambi i parametri valgono 1.12.33
Gli altri parametri devone essere impostati per configurare il sistema e praticamente non sarà
necessario modificarli durante gli upgrade successivi.

Nello use case di upgrade di ERP, prima di procedere si richiedono le seguenti operazioni preliminari:
- un backup del database di ERP
- di installare in un folder diverso da quello esistente
- di copiare il file di configurazione dal vecchio folder al nuovo prima di modificare i parametri di installazione.

Il parametro OLD_VERSION prende il valore del parametro NEW_VERSION e NEW_VERSION
deve essere impostato con il valore della release che viene installata.
Es: se OLD_VERSION=1.0.22 NEW_VERSION=1.1.10 e la versione della nuova release da installare è 1.2.0
allora OLD_VERSION=1.1.10 e NEW_VERSION=1.2.0

Lo script effettuerà le seguenti macro operazioni:
- shutdown dell'application server se running
- installazione dei file nelle corrispondenti locazioni
- startup dell'application server e quindi dell'applicazione
 
Se qualcosa va storto potrete sempre rimuovere la nuova applicazione ERP-ERP e rinominare quella salvata 
dallo script ERP-ERP.<version> in ERP-ERP e far ripartire tomcat

Su macchine Unix like:
Rendere eseguibile il file install-erp.sh con chmod +x 
Quindi lanciare lo script install-erp.sh
Se al momento del lancio dello script shell, dovesse fallire e compaiono caratteri ^M (control M), 
utilizzare il tool dos2unix per bonificare i file *.sh e *.conf 

con i dati attuali del datasource.
Quindi lanciare lo script install-erp.sh

ATTENZIONE!
2) Su macchine Microsoft Windows:
Dovuto al limite dei comandi della shell Microsoft Windows non è possibile effettuare il search and replace 
di una word all'interno di un file, quindi occorre copiare ed editare a mano i seguenti file:
- context.xml sotto %TOMCAT_HOME%\conf per valorizzare i token del data source
- server.xml sotto %TOMCAT_HOME%\conf per valorizzare i token del data source e permettere a TOMCAT di accedere a
  ERPDB per l'autenticiazione in fase di login
- create_tablespaces_erp.sql sotto la directory Data per valorizzare i token 
  TSD_DIR e TSI_DIR con i full path name delle corrispondenti directories 
- user-create_erp.sql sotto la directory Data per valorizzare il token 
  DB_PASSWORD con la password dell'utente creato 
- setenv.bat sotto %TOMCAT_HOME%\bin per inserire nel classpath di TOMCAT il path ERP home
- in alcune versioni Windows XP/VISTA a fronte della creazione delle table space si riscontra
  il seguente errore: 
  ERROR:  could not set permissions on directory "E:/luciano/Deploy/DB/ErpIndex": Permission denied
  Usare i seguenti comando e riprocare:
  cacls E:/luciano/Deploy/DB/ErpData /E /G networkservice:F
  cacls E:/luciano/Deploy/DB/ErpIndex /E /G networkservice:F

Luciano Martino

