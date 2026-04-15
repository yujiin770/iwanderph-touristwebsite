import { supabase } from '../config/supabase.js';

export async function getAllGallery(req, res) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function uploadGalleryPhoto(req, res) {
  try {
    const { title, url } = req.body;

    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        title,
        url,
        created_at: new Date(),
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteGalleryPhoto(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
