-- Tourney 1.0
-- ==============
-- Description : table Session and related object relations

ALTER TABLE ONLY session ADD CONSTRAINT session_id_pk PRIMARY KEY (id); 
      
CREATE UNIQUE INDEX user_session_index
ON session (user_session);
