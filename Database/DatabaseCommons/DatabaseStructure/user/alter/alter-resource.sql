-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY resource
    ADD CONSTRAINT resource_id_pk PRIMARY KEY (id); 

CREATE UNIQUE INDEX resource_index
ON resource  USING btree (name COLLATE pg_catalog."default");

ALTER TABLE resource OWNER TO :SCHEMA_USER_NAME;
