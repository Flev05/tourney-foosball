-- Tourney 1.0

ALTER TABLE ONLY client
    ADD CONSTRAINT client_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY client
    ADD CONSTRAINT client_country_id_fk 
    FOREIGN KEY (country_id) REFERENCES country(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE client OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX client_email_key_index ON client (email);
