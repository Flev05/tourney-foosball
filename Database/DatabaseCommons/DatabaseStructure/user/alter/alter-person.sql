-- EREBUS 1.0
-- ==============
-- Description : table Task and related object creation

ALTER TABLE ONLY person
    ADD CONSTRAINT person_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY person
    ADD CONSTRAINT person_user_id_fk 
    FOREIGN KEY (user_id) REFERENCES user_table(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE person OWNER TO :SCHEMA_USER_NAME;  	