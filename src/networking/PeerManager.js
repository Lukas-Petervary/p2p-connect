import { PacketRegistry } from './PacketRegistry.js';
import { HandshakePacket, MessagePacket, AlertPacket } from "../packets/Packets.js";

export default class PeerManager {
    static instance;

    constructor() {
        PeerManager.instance = this;
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
        return PeerManager.instance;
    }

    static printConnections() {
        console.log([...PeerManager.instance.connections.keys()]);
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
            if (connection.peerId !== this.peerId)
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
        const handshakePacket = JSON.stringify(new HandshakePacket(this.peerId), null, 2);
        connection.send(handshakePacket);
    }

    sendMessage(message) {
        const messagePacket = JSON.stringify(new MessagePacket(this.peerId+': '+message), null, 2);
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(messagePacket);
            }
        });
    }

    sendAlert(message) {
        const alertPacket = JSON.stringify(new AlertPacket(message), null, 2);
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(alertPacket);
            }
        });
    }

    broadcastPacket(packet) {
        const jsonPacket = JSON.stringify(packet, null, 2);
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(jsonPacket);
            }
        });
    }
}