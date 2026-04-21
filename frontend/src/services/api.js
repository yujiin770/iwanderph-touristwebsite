import axios from 'axios';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_COOLDOWN_MS = 3 * 60 * 60 * 1000;
const EMAILJS_DAILY_LIMIT = 10;
const EMAILJS_DUPLICATE_WINDOW_MS = 12 * 60 * 60 * 1000;
const EMAILJS_STORAGE_KEY = 'iwander_contact_rate_limit';
let contactSubmissionInFlight = false;

const sanitizeContactValue = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

const readContactRateLimitState = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(EMAILJS_STORAGE_KEY) || '{}');
    return {
      date: parsed.date || '',
      count: Number(parsed.count || 0),
      lastSentAt: Number(parsed.lastSentAt || 0),
      lastAttemptAt: Number(parsed.lastAttemptAt || 0),
      recentFingerprints: Array.isArray(parsed.recentFingerprints) ? parsed.recentFingerprints : [],
    };
  } catch {
    return {
      date: '',
      count: 0,
      lastSentAt: 0,
      lastAttemptAt: 0,
      recentFingerprints: [],
    };
  }
};

const writeContactRateLimitState = (state) => {
  localStorage.setItem(EMAILJS_STORAGE_KEY, JSON.stringify(state));
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH SERVICES ====================
export const authService = {
  login: async (email, password) => {
    try {
      // Get admin user from your table
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !admin) {
        throw new Error('Invalid email or password');
      }

      // Compare password with bcrypt hash
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        throw new Error('Invalid email or password');
      }

      // Create simple token
      const token = btoa(JSON.stringify({ id: admin.id, email: admin.email }));
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(admin));

      return { data: { token, user: admin } };
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
};

// ==================== DESTINATIONS SERVICES ====================
export const destinationService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data };
  },

  // In create function
  create: async (destinationData) => {
    const { data, error } = await supabase
      .from('destinations')
      .insert([{
        name: destinationData.name,
        label: destinationData.label,
        description: destinationData.description,
        image: destinationData.image,
        rating: parseFloat(destinationData.rating) || 4.5,
        best_time: destinationData.best_time || 'November - May',
        activities: destinationData.activities || ['Sightseeing', 'Photography'], // Array format
        created_at: new Date()
      }])
      .select();

    if (error) throw error;
    return { data: data[0] };
  },

  // In update function
  update: async (id, destinationData) => {
    const { data, error } = await supabase
      .from('destinations')
      .update({
        name: destinationData.name,
        label: destinationData.label,
        description: destinationData.description,
        image: destinationData.image,
        rating: parseFloat(destinationData.rating) || 4.5,
        best_time: destinationData.best_time,
        activities: destinationData.activities // Should be array
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data: data[0] };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Deleted successfully' };
  }
};

// ==================== GALLERY SERVICES ====================
export const galleryService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  },

  create: async (galleryData) => {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        title: galleryData.title,
        url: galleryData.url,
        created_at: new Date()
      }])
      .select();

    if (error) throw error;
    return { data: data[0] };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Deleted successfully' };
  }
};

// ==================== HERO CONTENT SERVICES ====================
export const heroService = {
  get: async () => {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return {
      data: data || {
        title: 'Explore The Islands of The Philippines',
        description: 'Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient.'
      }
    };
  },

  update: async (heroData) => {
    const { data: existing } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      result = await supabase
        .from('hero_content')
        .update({
          title: heroData.title,
          description: heroData.description
        })
        .eq('id', existing[0].id)
        .select();
    } else {
      result = await supabase
        .from('hero_content')
        .insert([{
          title: heroData.title,
          description: heroData.description
        }])
        .select();
    }

    if (result.error) throw result.error;
    return { data: result.data[0] };
  }
};

// ==================== CONTACT SERVICES ====================
export const contactService = {
  getInfo: async () => {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return {
      data: data || {
        phone: '+63 917 123 4567',
        email: 'info@iwanderph.com',
        address: 'Manila, Philippines'
      }
    };
  },

  updateInfo: async (contactData) => {
    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      result = await supabase
        .from('contact_info')
        .update({
          phone: contactData.phone,
          email: contactData.email,
          address: contactData.address
        })
        .eq('id', existing[0].id)
        .select();
    } else {
      result = await supabase
        .from('contact_info')
        .insert([{
          phone: contactData.phone,
          email: contactData.email,
          address: contactData.address
        }])
        .select();
    }

    if (result.error) throw result.error;
    return { data: result.data[0] };
  },

  sendMessage: async (messageData) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS is not configured yet.');
    }

    if (contactSubmissionInFlight) {
      throw new Error('A message is already being sent. Please wait.');
    }

    if (messageData.website) {
      throw new Error('Spam detected.');
    }

    const cleanedName = sanitizeContactValue(messageData.name);
    const cleanedEmail = sanitizeContactValue(messageData.email).toLowerCase();
    const cleanedMessage = String(messageData.message || '').replace(/\r\n/g, '\n').trim();

    if (!cleanedName || !cleanedEmail || !cleanedMessage) {
      throw new Error('Please complete all required fields.');
    }

    if (cleanedMessage.length < 12) {
      throw new Error('Message is too short.');
    }

    const secondsToSubmit = messageData.formStartedAt
      ? Math.floor((Date.now() - Number(messageData.formStartedAt)) / 1000)
      : 0;

    if (secondsToSubmit > 0 && secondsToSubmit < 8) {
      throw new Error('Please wait a little longer before submitting.');
    }

    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);
    const fingerprint = `${cleanedEmail}::${cleanedMessage.toLowerCase()}`;
    const rateLimitState = readContactRateLimitState();

    if (rateLimitState.date !== today) {
      rateLimitState.date = today;
      rateLimitState.count = 0;
      rateLimitState.lastSentAt = 0;
      rateLimitState.lastAttemptAt = 0;
      rateLimitState.recentFingerprints = [];
    }

    rateLimitState.recentFingerprints = rateLimitState.recentFingerprints.filter(
      (item) => now - Number(item.timestamp || 0) < EMAILJS_DUPLICATE_WINDOW_MS,
    );

    if (now - (rateLimitState.lastAttemptAt || 0) < 15000) {
      throw new Error('Please wait a few seconds before trying again.');
    }

    if (now - (rateLimitState.lastSentAt || 0) < EMAILJS_COOLDOWN_MS) {
      throw new Error('Please wait 3 hours before sending another message.');
    }

    if ((rateLimitState.count || 0) >= EMAILJS_DAILY_LIMIT) {
      throw new Error('Daily contact limit reached on this device. Please try again tomorrow.');
    }

    if (rateLimitState.recentFingerprints.some((item) => item.value === fingerprint)) {
      throw new Error('This same message was already sent recently.');
    }

    rateLimitState.lastAttemptAt = now;
    writeContactRateLimitState(rateLimitState);
    contactSubmissionInFlight = true;

    try {
      const response = await fetch(EMAILJS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            name: cleanedName,
            email: cleanedEmail,
            message: cleanedMessage,
            time: new Date().toLocaleString(),
            reply_to: cleanedEmail,
          },
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (responseText.includes('The template ID not found')) {
          throw new Error('EmailJS template ID was not found. Update VITE_EMAILJS_TEMPLATE_ID and restart the dev server.');
        }

        if (responseText.includes('The service ID not found')) {
          throw new Error('EmailJS service ID was not found. Update VITE_EMAILJS_SERVICE_ID and restart the dev server.');
        }

        if (responseText.includes('The Public Key is invalid')) {
          throw new Error('EmailJS public key is invalid. Check VITE_EMAILJS_PUBLIC_KEY and restart the dev server.');
        }

        throw new Error(responseText || 'Failed to send message.');
      }

      rateLimitState.count = (rateLimitState.count || 0) + 1;
      rateLimitState.lastSentAt = now;
      rateLimitState.recentFingerprints = [
        ...rateLimitState.recentFingerprints,
        { value: fingerprint, timestamp: now },
      ].slice(-10);
      writeContactRateLimitState(rateLimitState);
    } finally {
      contactSubmissionInFlight = false;
    }

    return { message: 'Message sent successfully' };
  }
};

// ==================== UPLOAD SERVICES (Supabase Storage) ====================
export const uploadService = {
  uploadImage: async (file, bucket) => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to upload files');
      }

      console.log('Uploading to bucket:', bucket);
      console.log('File:', file.name, file.size, 'bytes');
      console.log('User:', session.user.email);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('Upload successful!');
      console.log('Public URL:', publicUrl);

      return publicUrl;

    } catch (error) {
      console.error('Upload service error:', error);
      throw error;
    }
  }
};

export default api;
