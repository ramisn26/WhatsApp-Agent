-- Run this in Supabase SQL Editor to set up the database

create table conversations (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text,
  mode text not null default 'agent' check (mode in ('agent', 'human')),
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  whatsapp_msg_id text unique,
  created_at timestamp with time zone default now()
);

create table patients (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  notes text,
  status text default 'lead' check (status in ('lead', 'patient', 'archived')),
  date_of_birth date,
  insurance_provider text,
  preferred_contact_method text check (preferred_contact_method in ('whatsapp', 'email', 'phone')),
  medical_history text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  conversation_id uuid references conversations(id) on delete set null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  reason text,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table patient_notes (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  note text not null,
  created_by text default 'ai_agent',
  created_at timestamp with time zone default now()
);

create table documents (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  embedding vector(1536),
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create index idx_messages_conversation on messages(conversation_id);
create index idx_conversations_updated on conversations(updated_at desc);
create index idx_patients_conversation on patients(conversation_id);
create index idx_appointments_patient on appointments(patient_id);

-- Enable Realtime for the dashboard
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table patients;
