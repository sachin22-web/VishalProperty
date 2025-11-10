-- Add brochure_url column to properties table if not exists
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS brochure_url text;