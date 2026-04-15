import { supabase } from '../config/supabase.js';

export async function getHeroContent(req, res) {
  try {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || {
      title: 'Explore The Islands of The Philippines',
      description: 'Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient.',
    });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateHeroContent(req, res) {
  try {
    const { title, description } = req.body;

    const { data: existing } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      result = await supabase
        .from('hero_content')
        .update({ title, description })
        .eq('id', existing[0].id)
        .select();
    } else {
      result = await supabase
        .from('hero_content')
        .insert([{ title, description }])
        .select();
    }

    if (result.error) throw result.error;
    res.json(result.data[0]);
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
