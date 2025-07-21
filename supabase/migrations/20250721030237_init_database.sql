-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    embedding VECTOR(128)
);

-- Create the attendance_records table
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    check_in_time TIMESTAMPTZ DEFAULT NOW()
);

-- Create the match_student function
CREATE OR REPLACE FUNCTION match_student(
    query_embedding VECTOR(128),
    match_threshold FLOAT,
    match_count INT
) RETURNS TABLE (id UUID, name TEXT, similarity FLOAT) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, 1 - (embedding <=> query_embedding) AS similarity
    FROM students s
    WHERE 1 - (embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END $$ LANGUAGE plpgsql;

-- Add an index on the embedding column for fast similarity searches
CREATE INDEX students_embedding_idx
ON students
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);
