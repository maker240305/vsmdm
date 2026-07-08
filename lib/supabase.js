const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jyvfgwxnwmwziueayjee.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_S2Bz7w88W4MovRj3Sf6v0A_XSUesgtx';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = { supabase };
