ALTER TABLE students ADD COLUMN email VARCHAR(254);
ALTER TABLE students ADD COLUMN password_hash VARCHAR(100);
ALTER TABLE students ADD CONSTRAINT uq_students_email UNIQUE (email);
