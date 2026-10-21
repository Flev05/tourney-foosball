
md %WEB_CONTENT_DIR%\WEB-INF

xcopy %WEB_INF_SRC_DIR% %WEB_CONTENT_DIR%\WEB-INF

:: 2. Move files from /browser to the root
xcopy /E /Y "%WEB_CONTENT_DIR%\browser\*" "%WEB_CONTENT_DIR%\"

:: 3. Clean up the empty browser folder
rd /S /Q "%WEB_CONTENT_DIR%\browser"
