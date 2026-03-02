-- Tourney 1.0
-- ==============
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY discipline
    ADD CONSTRAINT discipline_id_pk PRIMARY KEY (id); 

ALTER TABLE discipline OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX discipline_name_key_index ON discipline (name);