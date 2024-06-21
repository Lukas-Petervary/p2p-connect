export default class MessageService {
    constructor() {
        this.messagesDiv = document.getElementById('messages');
    }

    appendMessage(message) {
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        this.messagesDiv.appendChild(messageElem);
    }

    handleSendButton(peerManager) {
        document.getElementById('send-btn').addEventListener('click', () => {
            const message = document.getElementById('message').value.trim();
            document.getElementById('message').value = '';
            if (message) {
                peerManager.sendMessage(peerManager.peerId + ': ' + message);
                this.appendMessage('Sent: ' + message);
            }
        });
    }

    handleConnectButton(peerManager) {
        document.getElementById('connect-btn').addEventListener('click', () => {
            const destPeerId = document.getElementById('peer-id-input').value.trim();
            if (destPeerId) {
                peerManager.connectToPeer(destPeerId, {
                    onData: data => this.appendMessage(data)
                });
            } else {
                alert('Enter destination peer ID');
            }
        });
    }
}