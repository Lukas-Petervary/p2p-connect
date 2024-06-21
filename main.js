import PeerManager from './src/networking/PeerManager.js';

const peerManager = new PeerManager();

peerManager.initialize({
    onData: data => appendMessage('Received: ' + data)
});

document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();
    document.getElementById('message').value = '';
    if (message) {
        peerManager.sendMessage(message);
        appendMessage('Sent: ' + message);
    }
});

document.getElementById('connect-btn').addEventListener('click', () => {
    const destPeerId = document.getElementById('peer-id-input').value.trim();
    if (destPeerId) {
        peerManager.connectToPeer(destPeerId, {
            onData: data => appendMessage('Received: ' + data)
        });
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