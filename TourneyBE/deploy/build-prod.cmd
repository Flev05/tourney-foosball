cd %FE_DIR%

rem ng build --prod --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%
.\node_modules\.bin\ng build -c production --base-href=/TourneyBE/ --output-path=%WEB_CONTENT_DIR%
