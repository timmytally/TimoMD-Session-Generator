const express = require('express');
const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Timo MD Session Generator');
});

app.get('/generate', async (req, res) => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state, printQRInTerminal: false });
  sock.ev.once('connection.update', (update) => {
    if (update.qr) res.json({ qr: update.qr });
  });
  sock.ev.on('creds.update', saveCreds);
});

app.listen(port, () => console.log(`Server running on port ${port}`));