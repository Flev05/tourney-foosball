-- Tourney 1.0

ALTER TABLE ONLY client
    ADD CONSTRAINT client_id_pk PRIMARY KEY (id); 
    
ALTER TABLE client OWNER TO :SCHEMA_USER_NAME;

CREATE UNIQUE INDEX client_email_key_index ON client (email);
