import PeerManager from "../networking/PeerManager.js";

let handshakeList = [];

class GenericPacket {
    constructor(type) {
        this.type = type;
    }
}

class HandshakePacket extends GenericPacket {


    constructor(peerId) {
        super('handshake');
        this.peerId = peerId;
    }

    toJSON() {
        return {
            type: this.type,
            peerId: this.peerId
        };
    }

    static handleHandshake(packet, fromPeerId) {
        const network = PeerManager.getInstance();
        const peerId = packet.peerId;
        console.log('Handshake from peerID: "'+fromPeerId+'"');

        // if connection map does not contain received handshake
        if (!handshakeList.includes(peerId) && peerId !== network.peerId) {
            console.log('Connecting to new peer from handshake: ' + peerId);
            //network.connectToPeer(peerId);
            network.broadcastPacket(packet);
            handshakeList.push(peerId);
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