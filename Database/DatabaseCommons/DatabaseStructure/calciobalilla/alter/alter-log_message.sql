-- EREBUS 1.0
-- ==============
-- Description : table Task and related object creation


ALTER TABLE ONLY log_message
    ADD CONSTRAINT log_message_id_pk PRIMARY KEY (id); 

ALTER TABLE log_message OWNER TO :SCHEMA_USER_NAME;