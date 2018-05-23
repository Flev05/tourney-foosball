-- EREBUS 1.0
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation


ALTER TABLE ONLY company_ipg
    ADD CONSTRAINT company_ipg_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY company_ipg
    ADD CONSTRAINT company_ipg_company_id_fk 
    FOREIGN KEY (company_id) REFERENCES company (id) MATCH SIMPLE
    ON UPDATE NO ACTION 
    ON DELETE NO ACTION 
    DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY company_ipg
    ADD CONSTRAINT company_ipg_ipg_id_fk 
    FOREIGN KEY (ipg_id) REFERENCES ipg (id) MATCH SIMPLE
    ON UPDATE NO ACTION 
    ON DELETE NO ACTION 
    DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE company_ipg OWNER TO :SCHEMA_USER_NAME; 