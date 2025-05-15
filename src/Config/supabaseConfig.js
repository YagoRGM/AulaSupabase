import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rdwcrvajzknnsoevigwp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd2NydmFqemtubnNvZXZpZ3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDc0OTksImV4cCI6MjA2Mjg4MzQ5OX0.IOwyJ-2hHmDskDK1raC55HcfD1jB-bs7gZ9j7TzL2wQ';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SupaBase URl ou chave não estão configuradas corretamente!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    enabled: false,
  },
});
