REM Attenzione: il comando ng build --watch deve essere lanciato nella directory di sviluppo: TourneyNG
rem quindi prima caricare le variabili d'ambiente lanciando i comandi con il cut and past in una finestra DOS
rem e poi lanciare il comando di watch

set TOURNEY_DIR=C:\views\EREBUS\CalcioBalilla

set FE_DIR=%TOURNEY_DIR%\TourneyNG
set BE_DIR=%TOURNEY_DIR%\TourneyBE

set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF

md %WEB_CONTENT_DIR%\WEB-INF
xcopy %WEB_INF_SRC_DIR% %WEB_CONTENT_DIR%\WEB-INF

ng build --watch --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR% 
