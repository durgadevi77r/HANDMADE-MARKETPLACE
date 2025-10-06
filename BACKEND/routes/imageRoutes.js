import express from 'express';
import { URL } from 'url';

const router = express.Router();

// Simple image proxy to bypass hotlinking and referrer checks
router.get('/', async (req, res) => {
  try {
    const raw = req.query.url;
    if (!raw || typeof raw !== 'string') {
      return res.status(400).send('Missing url');
    }

    // Validate URL
    let target;
    try {
      target = new URL(raw);
    } catch (_) {
      return res.status(400).send('Invalid url');
    }
    if (!/^https?:$/.test(target.protocol)) {
      return res.status(400).send('Unsupported protocol');
    }

    // Fetch with neutral headers to avoid hotlink blocks
    const response = await fetch(target.toString(), {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        // Many hosts require a referer to their own origin to allow image access
        'Referer': target.origin,
        'Origin': target.origin,
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Upstream error');
    }

    // Copy content-type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const arrayBuffer = await response.arrayBuffer();
    return res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(500).send('Proxy error');
  }
});

export default router;


