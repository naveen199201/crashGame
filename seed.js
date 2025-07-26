import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/player.js';
import connectDB from './config/db.js';

dotenv.config();

const players = [
  {
    username: 'alice',
    wallet: 100 // USD
  },
  {
    username: 'bob',
    wallet: 50 // USD
  },
  {
    username: 'charlie',
    wallet: 200 // USD
  }
];

async function seedDB() {
  try {
    await connectDB();
    console.log('MongoDB connected');

    await Player.deleteMany({});
    console.log('Old players removed');

    const createdPlayers = await Player.insertMany(players);
    console.log('New players added:');
    createdPlayers.forEach(player => {
      console.log(`- ${player.username}: ${player._id}`);
    });

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedDB();
