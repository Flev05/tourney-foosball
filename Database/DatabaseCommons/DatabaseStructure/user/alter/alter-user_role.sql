-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_user_table_id_fk 
    FOREIGN KEY (user_id) REFERENCES user_table(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_role_id_fk 
    FOREIGN KEY (role_id) REFERENCES role(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE user_role OWNER TO :SCHEMA_USER_NAME;