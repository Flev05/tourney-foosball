-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY permission
    ADD CONSTRAINT permission_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY permission
    ADD CONSTRAINT permission_role_id_fk 
    FOREIGN KEY (role_id) REFERENCES role(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE ONLY permission
    ADD CONSTRAINT permission_resource_id_fk 
    FOREIGN KEY (resource_id) REFERENCES resource(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
 
ALTER TABLE permission OWNER TO :SCHEMA_USER_NAME;