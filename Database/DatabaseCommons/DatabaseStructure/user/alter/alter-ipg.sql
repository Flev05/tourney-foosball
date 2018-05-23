-- EREBUS 1.0
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation

-- table

ALTER TABLE ONLY ipg
    ADD CONSTRAINT ipg_id_pk PRIMARY KEY (id); 

ALTER TABLE ipg OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX ipg_name_key_index 
	ON ipg (name);