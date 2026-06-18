CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  service_requested text NOT NULL,
  message text,
  time_received timestamptz NOT NULL DEFAULT now(),
  ai_status text NOT NULL DEFAULT 'Drafting',
  ai_draft_text text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_leads" ON leads FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_leads" ON leads FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_leads" ON leads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_leads" ON leads FOR DELETE
  TO authenticated USING (true);

CREATE INDEX idx_leads_time_received ON leads(time_received DESC);
