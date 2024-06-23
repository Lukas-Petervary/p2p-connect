export class PacketRegistry {
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