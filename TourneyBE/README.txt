I comandi ng devono essere lanciati sempre dell'interno della cartella TourneyNG perchè lì si trovano i sorgenti della GUI.
Quindi da una finestra DOS devono essere caricate sempre le vaiabili di ambiente e poi eseguire il comando.
Allo scopo fare un cat and past dagli script *.cmd alla finstra DOS.

Di seguito sono riportate le linee guida per il porgetto Tourney.

1) Per lo sviluppo e il test dell'applicazione seguire i segusnti passi:
portarsi sotto la directory di sviluppo:
C:\views\EREBUS\Tourney\TourneyNG
cat and past delle righe sotto:

###################### Begin Versione di Sviluppo ##################################
-------------------------------- ENVY HP Tourney ---------------------
set TOURNEY_DIR=C:\views\EREBUS\Tourney
set FE_DIR=%TOURNEY_DIR%\TourneyNG
set BE_DIR=%TOURNEY_DIR%\TourneyBE
set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF
cd %FE_DIR%
ng serve
#ng build --watch --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%

-------------------------------- ENVY HP Tourney 2.0 ---------------------
set TOURNEY_DIR=C:\views\EREBUS\Tourney-2.0
set FE_DIR=%TOURNEY_DIR%\TourneyNG-2.0
set BE_DIR=%TOURNEY_DIR%\TourneyBE
set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF
cd %FE_DIR%
ng serve

######################  GMKTEC -------------------------------------- 
set NODE_OPTIONS=--openssl-legacy-provider
set TOURNEY_DIR=C:\views\EREBUS\Tourney-2.0
set FE_DIR=%TOURNEY_DIR%\TourneyNG-2.0
set BE_DIR=%TOURNEY_DIR%\TourneyBE
set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF
cd %FE_DIR%
ng serve
#ng build --watch --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%

###################### End    Versione di Sviluppo ##################################

###################### Ambiente di PRODUZIONE su erebus-soft.com ##################################
1) Per la produzione lanciare il contenuto dello script:
TourneyBE/deploy/build-project-prod.cmd 
come descritto sopra

2) Per produrre il .war di produzione, spostarsi sotto TourneyBE e lanciare lo script:

mvn21.cmd

che imposta la JVM 21, lancia mnv clean install e produrrà il file TourneyBE.war sotto target

3) Connettersi in SSH con PUTTY al server www.erebus-soft.com
con l'utente: wildfly/<la solita short>
aprire le porte 8380 e 9991 in modo che il PC veda l'Application Server WildFly installato sul server
Aprire la pagina Web: http://localhost:8380 e collegarsi alla console di WildFly con:
Usename: wildfly
Password: <la solita short>
###################### End    Versione di PRODUZIONE su erebus-soft.com ##################################

Copiare a manina la cartella WEB-INF da %WEB_INF_SRC_DIR% a %WEB_CONTENT_DIR%\WEB-INF 

Luciano Martino
