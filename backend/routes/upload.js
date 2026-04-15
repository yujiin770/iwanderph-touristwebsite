import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'None');
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get bucket from FormData fields or default
    const bucket = req.body.bucket || req.body.Bucket || 'general';
    
    if (!bucket) {
      return res.status(400).json({ error: 'Bucket not specified' });
    }

    console.log(`Uploading to bucket: ${bucket}`);
    
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed: ' + uploadError.message });
    }

    console.log('File uploaded successfully:', fileName);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
