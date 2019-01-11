-- Tourney 1.0
-- ==============
-- Description : table Session and related object relations

ALTER TABLE ONLY session ADD CONSTRAINT session_id_pk PRIMARY KEY (id); 
      
CREATE UNIQUE INDEX session_id_index
ON session (session_id);
