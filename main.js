import PeerManager from './src/networking/PeerManager.js';

const peerManager = new PeerManager();
peerManager.initialize();

document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();
    document.getElementById('message').value = '';
    if (message) {
        if (message.startsWith('§')) {
            peerManager.sendAlert(message.substring(1));
        } else {
            peerManager.sendMessage(message);
            appendMessage('Sent: ' + message);
        }
    }
});

document.getElementById('connect-btn').addEventListener('click', () => {
    const destPeerId = document.getElementById('peer-id-input').value.trim();
    if (destPeerId) {
        peerManager.connectToPeer(destPeerId);
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
    PeerManager.printConnections();
});