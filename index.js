const express = require('express');
const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let globalSock;

app.get('/', (req, res) => {
    res.send('Timo MD Session Generator - Baileys MD');
});

app.get('/generate', async (req, res) => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    globalSock = sock;

    sock.ev.once('connection.update', ({ qr }) => {
        if (qr) {
            return res.json({ qr });
        }
    });

    sock.ev.on('creds.update', saveCreds);
});

app.listen(port, () => {
    console.log(`Timo MD Session Generator running on port ${port}`);
});