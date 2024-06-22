import { PacketRegistry, HandshakePacket, MessagePacket, AlertPacket } from './PacketRegistry.js';

export default class PeerManager {
    constructor() {
        this.peerId = localStorage.getItem('peerId') || this.generatePeerId();
        localStorage.setItem('peerId', this.peerId);
        this.peer = new Peer(this.peerId);
        this.connections = new Map(); // Store connections as a map
        this.packetRegistry = new PacketRegistry(); // Initialize packet registry

        this.packetRegistry.registerPacket('handshake', HandshakePacket.handleHandshake.bind(this));
        this.packetRegistry.registerPacket('message', MessagePacket.handleMessage.bind(this));
        this.packetRegistry.registerPacket('alert', AlertPacket.handleAlert.bind(this));
    }

    static getInstance() {
        return this;
    }

    static printConnections() {
        console.log([...this.connections.keys()]);
    }

    generatePeerId() {
        return Math.random().toString(36).substring(7);
    }

    initialize() {
        this.peer.on('open', id => {
            console.log('My peer ID is: ' + id);
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
        const messagePacket = JSON.stringify(new MessagePacket(this.peerId+': '+message));
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