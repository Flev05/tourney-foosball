-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY tourney
    ADD CONSTRAINT tourney_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY tourney
    ADD CONSTRAINT tourney_client_id_fk 
    FOREIGN KEY (client_id) REFERENCES client(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY tourney
    ADD CONSTRAINT tourney_session_id_fk 
    FOREIGN KEY (session_id) REFERENCES session(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY tourney
    ADD CONSTRAINT tourney_discipline_id_fk 
    FOREIGN KEY (discipline_id) REFERENCES discipline(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;
  	
ALTER TABLE tourney OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX tourney_name_client_id_key_index ON tourney (client_id, tourney_name);
