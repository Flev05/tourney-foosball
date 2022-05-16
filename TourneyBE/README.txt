Di seguito sono riportate le linee guida per il porgetto Tourney.

Per lo sviluppo e il test dell'applicazione seguire i segusnti passi:
portarsi sotto la directory di sviluppo:
C:\views\EREBUS\CalcioBalilla\TourneyNG
eseguire i passi:

set TOURNEY_DIR=C:\views\EREBUS\CalcioBalilla

set FE_DIR=%TOURNEY_DIR%\TourneyNG
set BE_DIR=%TOURNEY_DIR%\TourneyBE

set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF

ng build --watch --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%


Copiare a manaina la cartella WEB-INF da %WEB_INF_SRC_DIR% a %WEB_CONTENT_DIR%\WEB-INF 

Luciano Martino

