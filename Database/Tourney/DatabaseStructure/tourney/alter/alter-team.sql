-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY team
    ADD CONSTRAINT team_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY team
    ADD CONSTRAINT team_client_id_fk 
    FOREIGN KEY (client_id) REFERENCES client(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY team
    ADD CONSTRAINT team_session_id_fk 
    FOREIGN KEY (session_id) REFERENCES session(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE team OWNER TO :SCHEMA_USER_NAME;

