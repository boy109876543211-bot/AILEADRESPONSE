import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  customer_name: string;
  phone_number: string;
  service_requested: string;
  message: string | null;
  time_received: string;
  ai_status: string;
  ai_draft_text: string | null;
  sent_at: string | null;
  created_at: string;
};
