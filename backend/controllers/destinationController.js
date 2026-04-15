import { supabase } from '../config/supabase.js';

export async function getAllDestinations(req, res) {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getDestinationById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: 'Not found' });
  }
}

export async function createDestination(req, res) {
  try {
    const { name, label, description, image, rating } = req.body;

    const { data, error } = await supabase
      .from('destinations')
      .insert([{
        name,
        label,
        description,
        image,
        rating: parseFloat(rating) || 4.5,
        created_at: new Date(),
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateDestination(req, res) {
  try {
    const { id } = req.params;
    const { name, label, description, image, rating } = req.body;

    const { data, error } = await supabase
      .from('destinations')
      .update({
        name,
        label,
        description,
        image,
        rating: parseFloat(rating) || 4.5,
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteDestination(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
