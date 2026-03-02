-- Tourney 1.0
-- psql -d tourneydbtest -U tourney -f insert-all.sql
-- or
-- psql -d tourneydbprod -U tourney -f insert-all.sql

\cd user
\i insert-all.sql

\cd ../tourney
\i insert-discipline.sql
