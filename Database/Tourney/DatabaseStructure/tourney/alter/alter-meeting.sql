-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY meeting
    ADD CONSTRAINT meeting_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY meeting
    ADD CONSTRAINT meeting_tourney_id_fk 
    FOREIGN KEY (tourney_id) REFERENCES tourney(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE meeting OWNER TO :SCHEMA_USER_NAME;

