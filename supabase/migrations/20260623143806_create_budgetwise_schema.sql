/*
# BudgetWise AI - Initial Schema

## Overview
Single-tenant schema (no auth) for the BudgetWise AI fintech prototype.
All tables are open to anon + authenticated roles since this is a demo app.

## New Tables

### budget_profile
Stores the user's financial profile and settings.
- `id` (uuid, primary key)
- `monthly_income` (numeric) - gross monthly income
- `income_frequency` (text) - monthly/bi-weekly/weekly
- `employment_type` (text) - employed/self-employed/freelancer/business
- `needs_pct` / `wants_pct` / `savings_pct` / `investments_pct` / `debt_pct` - allocation percentages
- `onboarding_complete` (boolean)

### budget_categories
Line items in the Zero-Based Budget.
- `id` (uuid)
- `label` (text) - category name
- `icon` (text) - emoji icon
- `allocated` (numeric) - budgeted amount
- `spent` (numeric) - actual spent
- `color` (text) - hex color for charts
- `sort_order` (int)

### expenses
Individual transaction records.
- `id` (uuid)
- `name` (text) - merchant/description
- `category` (text) - category label
- `amount` (numeric)
- `expense_date` (date)
- `icon` (text)
- `notes` (text)

### goals
Financial savings goals.
- `id` (uuid)
- `name` (text)
- `icon` (text)
- `target_amount` (numeric)
- `current_amount` (numeric)
- `monthly_contribution` (numeric)
- `color` (text)
- `deadline` (text) - YYYY-MM
- `description` (text)
- `is_active` (boolean)

### nudges
AI-generated financial recommendations.
- `id` (uuid)
- `type` (text) - warning/positive/goal/insight
- `title` (text)
- `message` (text)
- `action` (text) - recommended action
- `impact` (text) - financial impact description
- `category` (text)
- `urgency` (text) - high/medium/low
- `icon` (text)
- `is_dismissed` (boolean)

### chat_messages
AI financial coach conversation history.
- `id` (uuid)
- `role` (text) - user/assistant
- `message` (text)
- `created_at` (timestamptz)

## Security
RLS enabled on all tables. Anon + authenticated policies since no auth is required for this prototype.
*/

-- Budget Profile
CREATE TABLE IF NOT EXISTS budget_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_income numeric NOT NULL DEFAULT 65000,
  income_frequency text NOT NULL DEFAULT 'monthly',
  employment_type text NOT NULL DEFAULT 'employed',
  needs_pct numeric NOT NULL DEFAULT 50,
  wants_pct numeric NOT NULL DEFAULT 20,
  savings_pct numeric NOT NULL DEFAULT 15,
  investments_pct numeric NOT NULL DEFAULT 10,
  debt_pct numeric NOT NULL DEFAULT 5,
  onboarding_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_budget_profile" ON budget_profile;
CREATE POLICY "anon_select_budget_profile" ON budget_profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_budget_profile" ON budget_profile;
CREATE POLICY "anon_insert_budget_profile" ON budget_profile FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_budget_profile" ON budget_profile;
CREATE POLICY "anon_update_budget_profile" ON budget_profile FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_budget_profile" ON budget_profile;
CREATE POLICY "anon_delete_budget_profile" ON budget_profile FOR DELETE TO anon, authenticated USING (true);

-- Budget Categories
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL DEFAULT '💰',
  allocated numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#4F46E5',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_budget_categories" ON budget_categories;
CREATE POLICY "anon_select_budget_categories" ON budget_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_budget_categories" ON budget_categories;
CREATE POLICY "anon_insert_budget_categories" ON budget_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_budget_categories" ON budget_categories;
CREATE POLICY "anon_update_budget_categories" ON budget_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_budget_categories" ON budget_categories;
CREATE POLICY "anon_delete_budget_categories" ON budget_categories FOR DELETE TO anon, authenticated USING (true);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  icon text NOT NULL DEFAULT '💸',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_expenses" ON expenses;
CREATE POLICY "anon_select_expenses" ON expenses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_expenses" ON expenses;
CREATE POLICY "anon_insert_expenses" ON expenses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_expenses" ON expenses;
CREATE POLICY "anon_update_expenses" ON expenses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_expenses" ON expenses;
CREATE POLICY "anon_delete_expenses" ON expenses FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '🎯',
  target_amount numeric NOT NULL,
  current_amount numeric NOT NULL DEFAULT 0,
  monthly_contribution numeric NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#4F46E5',
  deadline text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_goals" ON goals;
CREATE POLICY "anon_select_goals" ON goals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_goals" ON goals;
CREATE POLICY "anon_insert_goals" ON goals FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_goals" ON goals;
CREATE POLICY "anon_update_goals" ON goals FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_goals" ON goals;
CREATE POLICY "anon_delete_goals" ON goals FOR DELETE TO anon, authenticated USING (true);

-- Nudges
CREATE TABLE IF NOT EXISTS nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'insight',
  title text NOT NULL,
  message text NOT NULL,
  action text,
  impact text,
  category text,
  urgency text NOT NULL DEFAULT 'medium',
  icon text NOT NULL DEFAULT '💡',
  is_dismissed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_nudges" ON nudges;
CREATE POLICY "anon_select_nudges" ON nudges FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_nudges" ON nudges;
CREATE POLICY "anon_insert_nudges" ON nudges FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_nudges" ON nudges;
CREATE POLICY "anon_update_nudges" ON nudges FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_nudges" ON nudges;
CREATE POLICY "anon_delete_nudges" ON nudges FOR DELETE TO anon, authenticated USING (true);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at ASC);
