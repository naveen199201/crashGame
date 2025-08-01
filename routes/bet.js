import express from 'express';
import Player from '../models/player.js';
import GameRound from '../models/GameRound.js';
import Transaction from '../models/Transaction.js';
import { getCryptoPrice } from '../services/priceService.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/bet/place
router.post('/place', async (req, res) => {
  const { playerId, usdAmount, currency } = req.body;

  if (!['BTC', 'ETH'].includes(currency)) {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    if (player.wallet < usdAmount) {
      return res.status(400).json({ error: 'Insufficient USD balance' });
    }

    const price = await getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;

    const currentRound = await GameRound.findOne().sort({ createdAt: -1 });
    if (!currentRound) return res.status(400).json({ error: 'No active round' });

    currentRound.bets.push({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      didCashout: false
    });
    await currentRound.save();

    player.wallet -= usdAmount;
    await player.save();

    await Transaction.create({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: crypto.randomBytes(16).toString('hex'),
      priceAtTime: price
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bet/cashout
router.post('/cashout', async (req, res) => {
  const { playerId } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const currentRound = await GameRound.findOne().sort({ createdAt: -1 });
    if (!currentRound) return res.status(400).json({ error: 'No active round' });

    const bet = currentRound.bets.find(
      b => b.playerId.toString() === playerId && !b.didCashout
    );

    if (!bet) return res.status(400).json({ error: 'No active bet found or already cashed out' });

    // simulate current multiplier from time
    const timeElapsed = (Date.now() - new Date(currentRound.startTime).getTime()) / 1000;
    const growthFactor = 0.02;
    const multiplier = 1 + timeElapsed * growthFactor;

    const price = await getCryptoPrice(bet.currency);
    const payout = bet.cryptoAmount * multiplier;
    const usdValue = payout * price;

    player.wallet += usdValue;
    await player.save();

    bet.didCashout = true;
    bet.multiplierAtCashout = multiplier;
    await currentRound.save();

    await Transaction.create({
      playerId,
      usdAmount: usdValue,
      cryptoAmount: payout,
      currency: bet.currency,
      transactionType: 'cashout',
      transactionHash: crypto.randomBytes(16).toString('hex'),
      priceAtTime: price
    });

    res.json({ success: true, payout, multiplier, usdValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
