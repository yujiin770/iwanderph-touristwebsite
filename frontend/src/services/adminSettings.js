import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';

const RECOVERY_STORAGE_KEY = 'iwander_admin_recovery';
const RESET_REQUEST_STORAGE_KEY = 'iwander_admin_reset_request';
const RECOVERY_REDIRECT_PATH = '/login?mode=reset';
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

const readRecoverySettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(RECOVERY_STORAGE_KEY) || '{}');
    return {
      email: stored.email || '',
      securityQuestion: stored.securityQuestion || '',
      securityAnswerHash: stored.securityAnswerHash || '',
    };
  } catch {
    return {
      email: '',
      securityQuestion: '',
      securityAnswerHash: '',
    };
  }
};

const writeRecoverySettings = (settings) => {
  localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(settings));
};

const readResetRequestState = () => {
  try {
    return JSON.parse(localStorage.getItem(RESET_REQUEST_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeResetRequestState = (state) => {
  localStorage.setItem(RESET_REQUEST_STORAGE_KEY, JSON.stringify(state));
};

const getResetRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return `${window.location.origin}${RECOVERY_REDIRECT_PATH}`;
};

const getResetCooldownRemainingSeconds = (email) => {
  const trimmedEmail = String(email || '').trim().toLowerCase();

  if (!trimmedEmail) {
    return 0;
  }

  const resetRequestState = readResetRequestState();
  const lastRequestedAt = Number(resetRequestState[trimmedEmail] || 0);
  const cooldownRemainingMs = RESET_REQUEST_COOLDOWN_MS - (Date.now() - lastRequestedAt);

  return cooldownRemainingMs > 0 ? Math.ceil(cooldownRemainingMs / 1000) : 0;
};

export const adminSettingsService = {
  getRecoverySettings(email = '') {
    const stored = readRecoverySettings();

    if (!email || stored.email === email) {
      return stored;
    }

    return {
      email,
      securityQuestion: '',
      securityAnswerHash: '',
    };
  },

  async saveRecoverySettings(email, securityQuestion, securityAnswer) {
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedQuestion = String(securityQuestion || '').trim();
    const trimmedAnswer = String(securityAnswer || '').trim();

    if (!trimmedEmail) {
      throw new Error('No admin email found for recovery settings.');
    }

    if (!trimmedQuestion || !trimmedAnswer) {
      throw new Error('Security question and answer are required.');
    }

    const securityAnswerHash = await bcrypt.hash(trimmedAnswer.toLowerCase(), 10);

    writeRecoverySettings({
      email: trimmedEmail,
      securityQuestion: trimmedQuestion,
      securityAnswerHash,
    });

    return {
      email: trimmedEmail,
      securityQuestion: trimmedQuestion,
      securityAnswerHash,
    };
  },

  async verifyRecoveryAnswer(email, answer) {
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedAnswer = String(answer || '').trim().toLowerCase();
    const stored = readRecoverySettings();

    if (!stored.email || stored.email !== trimmedEmail) {
      throw new Error('No recovery setup was found for this email on this device.');
    }

    if (!stored.securityQuestion || !stored.securityAnswerHash) {
      throw new Error('Security question is not configured yet.');
    }

    const isMatch = await bcrypt.compare(trimmedAnswer, stored.securityAnswerHash);

    if (!isMatch) {
      throw new Error('Incorrect security answer.');
    }

    return stored;
  },

  async sendPasswordReset(email) {
    const trimmedEmail = String(email || '').trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error('Email is required.');
    }

    const resetRequestState = readResetRequestState();
    const secondsRemaining = getResetCooldownRemainingSeconds(trimmedEmail);

    if (secondsRemaining > 0) {
      throw new Error(`Please wait ${secondsRemaining} seconds before requesting another reset email.`);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: getResetRedirectUrl(),
    });

    if (error) {
      const isRateLimitError =
        error.status === 429 || /rate limit/i.test(String(error.message || ''));

      if (isRateLimitError) {
        throw new Error(
          'Supabase temporarily blocked the reset email because the email sending limit was reached. Please wait before trying again. If you are using Supabase built-in email for testing, its sending quota is very small.'
        );
      }

      throw error;
    }

    writeResetRequestState({
      ...resetRequestState,
      [trimmedEmail]: Date.now(),
    });
  },

  getResetCooldownRemainingSeconds,

  async changePassword(newPassword) {
    const trimmedPassword = String(newPassword || '').trim();

    if (!trimmedPassword) {
      throw new Error('New password is required.');
    }

    const { error } = await supabase.auth.updateUser({
      password: trimmedPassword,
    });

    if (error) {
      throw error;
    }
  },
};
