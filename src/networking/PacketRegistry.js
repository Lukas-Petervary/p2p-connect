import PeerManager from "./PeerManager.js";

const network = PeerManager.getInstance();

class PacketRegistry {
    constructor() {
        this.packetHandlers = new Map();
    }

    registerPacket(type, handler) {
        this.packetHandlers.set(type, handler);
    }

    handlePacket(data, fromPeerId, peerManager) {
        const parsedData = JSON.parse(data);
        const handler = this.packetHandlers.get(parsedData.type);
        if (handler) {
            handler(parsedData, fromPeerId, peerManager);
        } else {
            console.warn(`No handler for packet type: ${parsedData.type}`);
        }
    }
}

class HandshakePacket {
    constructor(peerId) {
        this.type = 'handshake';
        this.peerId = peerId;
    }

    static fromJSON(data) {
        return new HandshakePacket(data.peerId);
    }

    static handleHandshake(packet, fromPeerId) {
        const peerId = packet.peerId;
        console.log('Handshake from peerID: "'+fromPeerId+'"');

        // if connection map does not contain received handshake
        if (!network.connections.has(peerId) && peerId !== network.peerId) {
            console.log('Connecting to new peer from handshake: ' + peerId);
            network.connectToPeer(peerId);
            network.broadcastPacket(packet);
        }

    }
}

class MessagePacket {
    constructor(message) {
        this.type = 'message';
        this.message = message;
    }

    static fromJSON(data) {
        return new MessagePacket(data.message);
    }

    static handleMessage(packet) {
        const message = packet.message;

        const messagesDiv = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        messagesDiv.appendChild(messageElem);
    }
}

class AlertPacket {
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

export { PacketRegistry, HandshakePacket, MessagePacket, AlertPacket };