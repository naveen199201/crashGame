// routes/wallet.js
import express from 'express';
import Player from '../models/player.js';
import { getCryptoPrice } from '../services/priceService.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    res.json({
      wallet: player.wallet
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;