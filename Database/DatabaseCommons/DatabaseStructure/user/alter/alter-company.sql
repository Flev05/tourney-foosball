-- EREBUS 1.0
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY company
    ADD CONSTRAINT company_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY company
    ADD CONSTRAINT company_ipg_id_fk 
    FOREIGN KEY (ipg_id) REFERENCES ipg (id) MATCH SIMPLE
    ON UPDATE NO ACTION 
    ON DELETE NO ACTION 
    DEFERRABLE INITIALLY IMMEDIATE;
    
ALTER TABLE company OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX company_name_key_index 
	ON company (name);