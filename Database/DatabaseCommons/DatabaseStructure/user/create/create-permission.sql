-- Booking 1.0
-- ==============
-- Execution Schema (Booking): EREBUS-SOFT
-- Description : table Task and related object creation

-- table
CREATE TABLE permission
(
	id 				serial NOT NULL,
  	access_type 	character(2) NOT NULL,
  	role_type_id 	integer NOT NULL,
  	resource_id 	integer NOT NULL
);

