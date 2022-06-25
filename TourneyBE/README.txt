I comandi ng devono essere lanciati sempre dell'interno della cartella TourneyNG perchè lì si trovano i sorgenti della GUI.
Quindi da una finestra DOS devono essere caricate sempre le vaiabili di ambiente e poi eseguire il comando.
Allo scopo fare un cat and past dagli script *.cmd alla finstra DOS.

Di seguito sono riportate le linee guida per il porgetto Tourney.

1) Per lo sviluppo e il test dell'applicazione seguire i segusnti passi:
portarsi sotto la directory di sviluppo:
C:\views\EREBUS\CalcioBalilla\TourneyNG
cat and past delle righe sotto:

set TOURNEY_DIR=C:\views\EREBUS\CalcioBalilla
set FE_DIR=%TOURNEY_DIR%\TourneyNG
set BE_DIR=%TOURNEY_DIR%\TourneyBE
set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF
cd %FE_DIR%
ng build --watch --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%

Copiare a manaina la cartella WEB-INF da %WEB_INF_SRC_DIR% a %WEB_CONTENT_DIR%\WEB-INF 

2) Per la produzione lanciare il contenuto dello script;:
TourneyBE/deploy/build-project-prod.cmd 
come descritto sopra

3) Per produrre il .war di produzione, spostarsi sotto TourneyBE e lanciare maven:

mvn clean install
che produrrà il file TourneyBE.war sotto target

Connettersi in SSH con PUTTY al server www.erebus-soft.com
aprire le porte 8280 e 9990 in modo che il PC veda l'Application Server WildFly installato sul server
Aprire la pagina Web: http://localhost:8280 e collegarsi alla console di WildFly con:
Usename: lmartino
Password: <la solita short>

Luciano Martino
