-- Create notifications table
create table if not exists public.notifications (
  id uuid not null default gen_random_uuid (),
  type text not null, -- 'order', 'system', etc.
  title text not null,
  message text null,
  order_id uuid null, -- Optional link to an order
  read_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  user_id uuid null, -- Optional: targeting specific user (often admin doesn't need this if global)
  constraint notifications_pkey primary key (id),
  constraint notifications_order_id_fkey foreign key (order_id) references orders (id) on delete set null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies (Adjust based on your needs)
-- Allow authenticated users (admins) to view all notifications
create policy "Admins can view all notifications"
on public.notifications
for select
to authenticated
using (true);

-- Allow authenticated users (admins) to update (mark as read)
create policy "Admins can update notifications"
on public.notifications
for update
to authenticated
using (true);
