-- Add delivery_video_url column to orders table
-- This column will store YouTube video URLs for delivery proof

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_video_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN orders.delivery_video_url IS 'YouTube video URL showing the delivery process';
