import PeerManager from "../networking/PeerManager.js";

let handshakeList = [];

class GenericPacket {
    constructor(type) {
        this.type = type;
    }
}

class HandshakePacket extends GenericPacket {
    constructor(peerId, destination) {
        super('handshake');
        this.peerId = peerId;
        this.destination = destination;
    }

    toJSON() {
        return {
            type: this.type,
            peerId: this.peerId,
            destination: this.destination
        };
    }

    static handleHandshake(packet, fromPeerId) {
        const network = PeerManager.getInstance();
        console.log('Handshake from peerID: "'+fromPeerId+'"');

        const sender = packet.peerId;
        // if ID is not previously handshaked
        if (!handshakeList.includes(sender)) {
            console.log('Connecting to new peer from handshake: ' + fromPeerId);
            if (packet.destination !== network.peerId)
                network.connectToPeer(sender);
            network.broadcastPacket(packet);
            handshakeList.push(sender);
        }
    }
}

class MessagePacket extends GenericPacket {
    constructor(message) {
        super('message');
        this.message = message;
    }

    toJSON() {
        return {
            type: this.type,
            message: this.message
        };
    }

    static handleMessage(packet) {
        const message = packet.message;

        const messagesDiv = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        messagesDiv.appendChild(messageElem);
    }
}

class AlertPacket extends GenericPacket {
    constructor(message) {
        super('alert');
        this.message = message;
    }

    toJSON() {
        return {
            type: this.type,
            message: this.message
        };
    }

    static handleAlert(packet) {
        alert(packet.message);
    }
}

export { HandshakePacket, MessagePacket, AlertPacket };