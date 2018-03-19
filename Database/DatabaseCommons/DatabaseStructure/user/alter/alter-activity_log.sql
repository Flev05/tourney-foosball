-- Booking 1.0
-- ==============
-- Activity (activity code from TRAC) : #
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation


ALTER TABLE ONLY activity_log
    ADD CONSTRAINT activity_log_id_pk PRIMARY KEY (id); 

ALTER TABLE ONLY activity_log
    ADD CONSTRAINT activity_log_user_table_id_fk 
    FOREIGN KEY (user_id) REFERENCES user_table(id)
  	ON UPDATE NO ACTION 
  	ON DELETE NO ACTION 
  	DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE activity_log OWNER TO :SCHEMA_USER_NAME;