-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY player
    ADD CONSTRAINT player_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY player
    ADD CONSTRAINT player_client_id_fk 
    FOREIGN KEY (client_id) REFERENCES client(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY player
    ADD CONSTRAINT player_session_id_fk 
    FOREIGN KEY (session_id) REFERENCES session(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE ONLY player
    ADD CONSTRAINT player_country_id_fk 
    FOREIGN KEY (country_id) REFERENCES country(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE player OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX player_name_client_id_key_index ON player (client_id, player_name);
