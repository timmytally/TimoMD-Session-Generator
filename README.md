# WhatsApp Bot QR Code Generator

A simple web application that generates QR codes for pairing your WhatsApp bot using Baileys library.

## Features

- Generates QR code for WhatsApp Web authentication
- Real-time connection status updates
- Simple and responsive web interface
- Automatically reconnects if the connection is lost

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/whatsapp-bot-qr.git
   cd whatsapp-bot-qr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

2. Open your web browser and go to:

   ```
   http://localhost:3000
   ```

3. Scan the QR code using your WhatsApp mobile app:

   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code shown in the browser

4. Once connected, your WhatsApp session will be authenticated and you can close the browser tab. The next time you start the server, it should automatically connect without requiring a new QR code.

## How It Works

- The application uses Baileys library to create a WhatsApp Web session
- The QR code is generated on the server and displayed in the browser using Socket.IO for real-time updates
- Session information is saved in the `auth_info_baileys` directory for automatic reconnection

## Deployment

### Heroku

1. Create a new Heroku app
2. Set the following config vars:
   ```
   NPM_CONFIG_PRODUCTION=false
   ```
3. Deploy your code

### Other Platforms

Make sure to install dependencies and start the server using:

```
npm install --production
npm start
```

## License

MIT
