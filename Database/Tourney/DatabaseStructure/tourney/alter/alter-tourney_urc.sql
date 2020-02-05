-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

ALTER TABLE ONLY tourney_urc
    ADD CONSTRAINT tourney_urc_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY tourney_urc
    ADD CONSTRAINT tourney_urc_urc_id_fk 
    FOREIGN KEY (urc_id) REFERENCES user_role_client(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ONLY tourney_urc
    ADD CONSTRAINT tourney_urc_tourney_id_fk 
    FOREIGN KEY (tourney_id) REFERENCES tourney(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE tourney_urc OWNER TO :SCHEMA_USER_NAME;
