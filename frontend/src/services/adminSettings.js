// frontend/src/services/adminSettings.js
import { supabase } from '../lib/supabase';

export const adminSettingsService = {
  

  // Centralized Rate Limiter
  async isAllowedToRequest(email, type) {
    const { data, error } = await supabase.rpc('check_auth_cooldown', {
      target_email: email.trim().toLowerCase(),
      req_type: type
    });
    if (error) throw error;
    return data; // returns true or false
  },

  // Invite Flow
  async sendAdminInvite(email) {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check if they are already an admin
    const { data: existing } = await supabase.from('admin_users').select('email').eq('email', trimmedEmail).maybeSingle();
    if (existing) throw new Error('This email is already registered.');

    // 2. Rate Limit Check
    const allowed = await this.isAllowedToRequest(trimmedEmail, 'invite');
    if (!allowed) throw new Error('Too many requests. Please wait 5 minutes before trying again.');

    // 3. Send Supabase Invite
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: { emailRedirectTo: `${window.location.origin}/update-password` }
    });
    if (error) throw error;
  },

  // Forgot Password Flow
  async requestPasswordReset(email) {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Rate Limit Check
    const allowed = await this.isAllowedToRequest(trimmedEmail, 'reset');
    if (!allowed) throw new Error('Email already sent. Check your inbox or wait 5 minutes.');

    // 2. Send Supabase Reset
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/update-password`
    });
    if (error) throw error;
  },

  async updateSessionPassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }
};
