-- Tourney 1.0
-- ==============
-- Description : table Session and related object relations

ALTER TABLE ONLY session ADD CONSTRAINT session_id_pk PRIMARY KEY (id); 
      
ALTER TABLE session OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX user_id_session_index
ON session (user_id, user_session);
