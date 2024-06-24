import ConnectionManager from './src/networking/ConnectionManager.js';
import { PositionPacket } from "./src/networking/Packets.js";

const connection = new ConnectionManager();
connection.initialize();

document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();
    document.getElementById('message').value = '';
    if (message) {
        if (message.startsWith('§')) {
            connection.sendAlert(message.substring(1));
        } else {
            connection.sendMessage(message);
            appendMessage('Sent: ' + message);
        }
    }
});

document.getElementById('connect-btn').addEventListener('click', () => {
    const destPeerId = document.getElementById('peer-id-input').value.trim();
    if (destPeerId) {
        connection.connectToPeer(destPeerId);
    } else {
        alert('Enter destination peer ID');
    }
});

function appendMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElem = document.createElement('div');
    messageElem.textContent = message;
    messagesDiv.appendChild(messageElem);
}

document.getElementById('printConnectionsButton').addEventListener('click', () => {
    ConnectionManager.printConnections();
});

document.addEventListener('mousemove', event => {
    connection.broadcastPacket(new PositionPacket(event.x, event.y))
});