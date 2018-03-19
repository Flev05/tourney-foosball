-- EREBUS 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY role
    ADD CONSTRAINT role_id_pk PRIMARY KEY (id); 
    
ALTER TABLE ONLY role
	ADD CONSTRAINT role_role_type_id_fk 
	FOREIGN KEY (role_type_id)
	REFERENCES role_type (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY IMMEDIATE;
      
ALTER TABLE ONLY role
	ADD CONSTRAINT role_company_id_fk 
	FOREIGN KEY (company_id)
	REFERENCES company (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY IMMEDIATE;

CREATE UNIQUE INDEX role_index
  ON role
  USING btree
  (role_type_id, company_id, name);
  
ALTER TABLE role OWNER TO :SCHEMA_USER_NAME;