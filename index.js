const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dgram = require('dgram');

// Set up UDP server
const udpServer = dgram.createSocket('udp4');
const UDP_PORT = 9999;
const UDP_HOST = '0.0.0.0';

// Set up Express server
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle incoming UDP messages
udpServer.on('message', (message, remote) => {
    // console.log(`Received message: ${message.toString()} from ${remote.address}:${remote.port}`);
    // Emit message to connected clients via Socket.IO
    io.emit('udpMessage', { message: message.toString(), address: remote.address, port: remote.port });
});

udpServer.on('error', (err) => {
    console.error(`UDP server error: ${err.stack}`);
    udpServer.close();
});

udpServer.bind(UDP_PORT, UDP_HOST, () => {
    console.log(`UDP server listening on ${UDP_HOST}:${UDP_PORT}`);
});

// Start HTTP server
const HTTP_PORT = 8000;
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening on http://localhost:${HTTP_PORT}`);
});
