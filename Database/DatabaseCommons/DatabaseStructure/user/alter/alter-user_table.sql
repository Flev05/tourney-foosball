-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY user_table
    ADD CONSTRAINT user_id_pk PRIMARY KEY (id); 
      
CREATE UNIQUE INDEX user_username_key_index 
	ON user_table (username);
      
ALTER TABLE user_table OWNER TO :SCHEMA_USER_NAME;	