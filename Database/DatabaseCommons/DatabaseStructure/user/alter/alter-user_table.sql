-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY user_table
    ADD CONSTRAINT user_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY user_table
    ADD CONSTRAINT user_table_client_id_fk 
    FOREIGN KEY (client_id) REFERENCES client(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE ONLY user_table
    ADD CONSTRAINT user_table_country_id_fk 
    FOREIGN KEY (country_id) REFERENCES country(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
CREATE UNIQUE INDEX user_username_key_index 
	ON user_table (username);
      
ALTER TABLE user_table OWNER TO :SCHEMA_USER_NAME;	