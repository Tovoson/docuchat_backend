-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store documents and their embeddings
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536) -- 1536 is the standard dimension for OpenAI embeddings (text-embedding-3-small/ada-002)
);

-- Create an index for faster similarity search (IVFFlat or HNSW)
-- Using HNSW for better performance at the cost of memory
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
