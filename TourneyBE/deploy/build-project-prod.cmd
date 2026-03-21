REM Attenzione: lanciare i comandi con il cut and past in una finestra DOS posizionata sotto TourneyNG

REM Desktop HP
rem set TOURNEY_DIR=C:\DATA\DEVELOP\EREBUS\CalcioBalilla

rem Laptop LENOVO
rem set TOURNEY_DIR=C:\views\EREBUS\Tourney

rem Laptop GMKtec
set TOURNEY_DIR=C:\views\EREBUS\Tourney-2.0

set FE_DIR=%TOURNEY_DIR%\TourneyNG-2.0
set BE_DIR=%TOURNEY_DIR%\TourneyBE

set WEB_CONTENT_DIR=%BE_DIR%\WebContent
set WEB_INF_SRC_DIR=%BE_DIR%\src\main\webapp\WEB-INF

cd %FE_DIR%
call %BE_DIR%\deploy\build-prod.cmd

cd %BE_DIR%\deploy
call copy-web-inf.cmd

