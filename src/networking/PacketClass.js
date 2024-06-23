export class HandshakePacket {
    constructor(peerId) {
        this.type = 'handshake';
        this.peerId = peerId;
    }

    static fromJSON(data) {
        return new HandshakePacket(data.peerId);
    }

    static handleHandshake(packet, fromPeerId, peerManager) {
        const peerId = packet.peerId;
        console.log('Handshake from peerID: "' + fromPeerId + '"');

        if (!peerManager.connections.has(peerId) && peerId !== peerManager.peerId) {
            console.log('Connecting to new peer from handshake: ' + peerId);
            peerManager.connectToPeer(peerId);
            peerManager.broadcastPacket(packet);
        }
    }
}

export class MessagePacket {
    constructor(message) {
        this.type = 'message';
        this.message = message;
    }

    static fromJSON(data) {
        return new MessagePacket(data.message);
    }

    static handleMessage(packet, fromPeerId) {
        const message = packet.message;
        console.log('Received message from ' + fromPeerId + ': ' + message);

        // Example: append message to UI
        const messagesDiv = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        messagesDiv.appendChild(messageElem);
    }
}

export class AlertPacket {
    constructor(message) {
        this.type = 'alert';
        this.message = message;
    }

    static fromJSON(data) {
        return new AlertPacket(data.message);
    }

    static handleAlert(packet) {
        alert(packet.message);
    }
}
