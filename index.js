const express = require("express");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode-terminal");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Store active connections
const connections = new Map();

async function connectToWhatsApp(socket) {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      io.emit("qr", qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp(socket);
      }
    } else if (connection === "open") {
      io.emit("connected", "WhatsApp connected!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Store the socket connection
  connections.set(socket.id, { sock, saveCreds });

  // Handle client disconnection
  socket.on("disconnect", () => {
    const connection = connections.get(socket.id);
    if (connection) {
      connection.sock.ev.removeAllListeners();
      connections.delete(socket.id);
    }
  });
}

io.on("connection", (socket) => {
  console.log("New client connected");
  connectToWhatsApp(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
