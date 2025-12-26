-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'order' CHECK (type IN ('order', 'system', 'info')),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create notification when order is created
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for all admins
  INSERT INTO notifications (user_id, type, title, message, order_id)
  SELECT 
    up.user_id,
    'order',
    'Yeni Sipariş',
    'Yeni bir sipariş oluşturuldu. Sipariş #' || LEFT(NEW.id::text, 8),
    NEW.id
  FROM user_profiles up
  WHERE up.role = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification on order creation
DROP TRIGGER IF EXISTS on_order_created_notification ON orders;
CREATE TRIGGER on_order_created_notification
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_notification();

