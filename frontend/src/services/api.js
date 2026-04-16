import axios from 'axios';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  
  create: async (destinationData) => {
    const { data, error } = await supabase
      .from('destinations')
      .insert([{
        name: destinationData.name,
        label: destinationData.label,
        description: destinationData.description,
        image: destinationData.image,
        rating: parseFloat(destinationData.rating) || 4.5,
        created_at: new Date()
      }])
      .select();
    
    if (error) throw error;
    return { data: data[0] };
  },
  
  update: async (id, destinationData) => {
    const { data, error } = await supabase
      .from('destinations')
      .update({
        name: destinationData.name,
        label: destinationData.label,
        description: destinationData.description,
        image: destinationData.image,
        rating: parseFloat(destinationData.rating) || 4.5
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
    return { data: data || {
      title: 'Explore The Islands of The Philippines',
      description: 'Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient.'
    }};
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
    return { data: data || {
      phone: '+63 917 123 4567',
      email: 'info@iwanderph.com',
      address: 'Manila, Philippines'
    }};
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
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: messageData.name,
        email: messageData.email,
        message: messageData.message,
        created_at: new Date()
      }]);
    
    if (error) throw error;
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