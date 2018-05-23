-- EREBUS 1.0
-- ==============
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation


ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_id_pk PRIMARY KEY (id); 

ALTER TABLE customer OWNER TO :SCHEMA_USER_NAME;