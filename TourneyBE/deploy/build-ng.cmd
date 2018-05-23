REM Attenzione: lanciare i comandi con il cut and past in una finestra DOS

// Ufficio
set TOURNEY_DIR=D:\luciano\EREBUS\Tourneys

set FE_DIR=%TOURNEY_DIR%\TourneyNG
set BE_DIR=%TOURNEY_DIR%\TourneyBE

set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF

cd %FE_DIR%

ng build --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%

md %WEB_CONTENT_DIR%\WEB-INF

xcopy %WEB_INF_SRC_DIR% %WEB_CONTENT_DIR%\WEB-INF
