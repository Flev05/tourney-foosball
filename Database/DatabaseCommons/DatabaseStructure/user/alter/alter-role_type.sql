-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY role_type
    ADD CONSTRAINT role_type_id_pk PRIMARY KEY (id); 
    
CREATE UNIQUE INDEX role_type_name_index ON role_type (name);
    
ALTER TABLE role_type OWNER TO :SCHEMA_USER_NAME;