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
        console.log(`Handshake inbound from "${fromPeerId}":\n${JSON.stringify(packet)}\nCurrent handshakes: [${handshakeList}]`);

        const sender = packet.peerId;
        // if ID is not previously handshaked
        if (!handshakeList.includes(sender)) {
            handshakeList.push(sender);
            console.log(`Connecting from handshake "${fromPeerId}"`);
            network.connectToPeer(sender);

            const jsonPacket = JSON.stringify(packet);
            this.connections.forEach(conn => {
                console.log(`Broadcasting handshake to "${conn.peer}":\n${jsonPacket}`);
                if (conn.open) {
                    conn.send(jsonPacket);
                }
            });
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