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

    static handleHandshake(packet) {

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
}

class AlertPacket {
    constructor(message) {
        this.type = 'alert';
        this.message = message;
    }

    static fromJSON(data) {
        return new AlertPacket(data.message);
    }
}

export { PacketRegistry, HandshakePacket, MessagePacket, AlertPacket };