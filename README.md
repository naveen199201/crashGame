# 🎮 Crash Game Backend

Installation
git clone git@github.com:naveen199201/crashGame.git

npm install

add a .env  file

⚙️ Environment Variables
PORT=5000
MONGO_URI= yor database
COINGECKO_API=https://api.coingecko.com/api/v3/simple/price

After connecting the mongo db

🔃 Seeding Players
 ## node seed.js

Example Output
New players added:
- alice: 64f8e45cda9326c0ef103c9e
- bob: 64f8e45cda9326c0ef103c9f
- charlie: 64f8e45cda9326c0ef103ca0

### Run the App
npm run dev    # for nodemon
# or
node server.js


## 📬 API Endpoints
GET /api/wallet/:playerId

POST /api/bet/place
**Place a bet**
example json:

{
  "playerId": "mongo_player_id",
  "usdAmount": 10,
  "currency": "BTC"
}

POST /api/bet/cashout

Cash out a bet

{
  "playerId": "mongo_player_id"
}

**Deployment link**

    https://crashgame-d91j.onrender.com
