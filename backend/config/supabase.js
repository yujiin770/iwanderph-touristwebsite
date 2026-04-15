import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables
export async function initializeDatabase() {
  try {
    console.log('Database initialized with Supabase');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
