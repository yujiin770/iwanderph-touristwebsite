import { supabase } from '../config/supabase.js';
import { sendContactEmail } from '../config/mailer.js';

export async function getContactInfo(req, res) {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || {
      phone: '+63 917 123 4567',
      email: 'info@iwanderph.com',
      address: 'Manila, Philippines',
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateContactInfo(req, res) {
  try {
    const { phone, email, address } = req.body;

    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      result = await supabase
        .from('contact_info')
        .update({ phone, email, address })
        .eq('id', existing[0].id)
        .select();
    } else {
      result = await supabase
        .from('contact_info')
        .insert([{ phone, email, address }])
        .select();
    }

    if (result.error) throw result.error;
    res.json(result.data[0]);
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function sendContactMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Send email via nodemailer
    await sendContactEmail(name, email, message);

    // Save message to database
    await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        message,
        created_at: new Date(),
      }]);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}
