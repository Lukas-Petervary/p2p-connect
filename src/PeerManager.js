import PacketRegistry from './PacketRegistry.js';
import { HandshakePacket, MessagePacket, AlertPacket } from './networking/PacketClass.js';

export default class PeerManager {
    constructor() {
        this.peerId = localStorage.getItem('peerId') || this.generatePeerId();
        localStorage.setItem('peerId', this.peerId);
        this.peer = new Peer(this.peerId);
        this.connections = new Map(); // Store connections as a map
        this.packetRegistry = new PacketRegistry(); // Initialize packet registry

        // Register packet handlers with bound 'this' context
        this.packetRegistry.registerPacket('handshake', (packet, fromPeerId) => HandshakePacket.handleHandshake(packet, fromPeerId, this));
        this.packetRegistry.registerPacket('message', (packet, fromPeerId) => MessagePacket.handleMessage(packet, fromPeerId));
        this.packetRegistry.registerPacket('alert', (packet) => AlertPacket.handleAlert(packet));
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PeerManager();
        }
        return this.instance;
    }

    generatePeerId() {
        return Math.random().toString(36).substring(7);
    }

    initialize() {
        this.peer.on('open', id => {
            console.log('My peer ID is: ' + id);
            // Example: Update UI with peer ID
            document.getElementById('connection-id').textContent = 'Your Connection ID: ' + id;
        });

        this.peer.on('connection', connection => {
            console.log('Incoming connection from ' + connection.peer);
            this.addConnection(connection);
        });
    }

    connectToPeer(peerId) {
        if (this.connections.has(peerId)) {
            console.log('Already connected to ' + peerId);
            return;
        }

        const connection = this.peer.connect(peerId);
        connection.on('open', () => {
            console.log('Connected to ' + peerId);
            this.addConnection(connection);
            this.sendHandshake(connection);
        });
    }

    addConnection(connection) {
        this.connections.set(connection.peer, connection);
        connection.on('data', data => {
            this.packetRegistry.handlePacket(data, connection.peer, this);
        });

        connection.on('close', () => {
            console.log('Connection with ' + connection.peer + ' closed');
            this.connections.delete(connection.peer);
        });
    }

    sendHandshake(connection) {
        const handshakePacket = JSON.stringify(new HandshakePacket(this.peerId));
        connection.send(handshakePacket);
    }

    sendMessage(message) {
        const messagePacket = JSON.stringify(new MessagePacket(message));
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(messagePacket);
            }
        });
    }

    sendAlert(message) {
        const alertPacket = JSON.stringify(new AlertPacket(message));
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(alertPacket);
            }
        });
    }

    broadcastPacket(packet) {
        const jsonPacket = JSON.stringify(packet);
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(jsonPacket);
            }
        });
    }
}
