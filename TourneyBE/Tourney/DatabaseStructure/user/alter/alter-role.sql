-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY role
    ADD CONSTRAINT role_id_pk PRIMARY KEY (id); 
      
ALTER TABLE role OWNER TO :SCHEMA_USER_NAME;