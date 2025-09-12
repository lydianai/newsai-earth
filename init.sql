-- AI LENS Database Initialization
-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create database user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'ailens') THEN

      CREATE ROLE ailens LOGIN PASSWORD 'ailens2025';
   END IF;
END
$do$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ailens_db TO ailens;
GRANT ALL ON SCHEMA public TO ailens;
