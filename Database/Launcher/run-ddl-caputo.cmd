@ECHO OFF

set DDL_SCRIPT=execute-ddl.sql

:runDDL
SETLOCAL
	@echo Entering runDDL
	set msg="Running the SQL scripts to create the DB at first installation" 
	@echo %msg%
	

	for /f "delims=" %%a in ('chcp ^|find /c "932"') do @ SET CLIENTENCODING_JP=%%a
	if "%CLIENTENCODING_JP%"=="1" SET PGCLIENTENCODING=SJIS
	if "%CLIENTENCODING_JP%"=="1" SET /P PGCLIENTENCODING="Client Encoding [%PGCLIENTENCODING%]: "
	
	cd ..\Caputo\DDL
	
	psql -h 127.0.0.1 -d caputodb -U caputo -f %DDL_SCRIPT% 
		 
	set return_error=%ERRORLEVEL%
	@echo ERRORLEVEL=%return_error%
	if not "%return_error%"=="0" goto :eof
	
	cd ..\..\..\Launcher
ENDLOCAL 
GOTO:eof

