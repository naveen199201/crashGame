// server.js
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import betRoutes from './routes/bet.js';
import walletRoutes from './routes/wallet.js';
import { initSocket } from './sockets/gameSocket.js';
import { startGameEngine } from './services/gameEngine.js';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

await connectDB()

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('The app is working 🚀');
})
app.use('/api/bet', betRoutes);
app.use('/api/wallet', walletRoutes);

initSocket(io);
startGameEngine(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
