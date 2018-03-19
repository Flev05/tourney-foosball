#!/bin/sh


DDL_SCRIPT=execute-ddl.sql

createDb() {
	msg="Running the SQL scripts to create the DB at first installation"
	echo $msg
	
	cd ../Caputo/DDL

	psql -h 127.0.0.1 -d caputodb -U caputo -f $DDL_SCRIPT 
	
	ERRORLEVEL=$?
	if [ "$ERRORLEVEL" != "0" ];
	then
		echo "ERRORLEVEL=$ERRORLEVEL. Data base creation failed"
		return $ERRORLEVEL
	fi

	cd -

	return 0
}

main () {
	createDb
	
	ERRORLEVEL=$?
	if [ "$ERRORLEVEL" != "0" ];
	then
		echo "ERRORLEVEL=$ERRORLEVEL. Database creation failed."
		return $ERRORLEVEL
	fi
}

main $1

