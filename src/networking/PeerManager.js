export default class PeerManager {
    constructor() {
        this.peerId = localStorage.getItem('peerId') || this.generatePeerId();
        localStorage.setItem('peerId', this.peerId);
        this.peer = new Peer(this.peerId);
        this.connections = new Map(); // Store connections as a map
    }

    generatePeerId() {
        return Math.random().toString(36).substring(7);
    }

    initialize(callbacks) {
        this.peer.on('open', id => {
            console.log('My peer ID is: ' + id);
            document.getElementById('connection-id').textContent = 'Your Connection ID: ' + id;
        });

        this.peer.on('connection', connection => {
            console.log('Incoming connection from ' + connection.peer);
            this.addConnection(connection, callbacks);
        });
    }

    connectToPeer(peerId, callbacks) {
        if (this.connections.has(peerId)) {
            console.log('Already connected to ' + peerId);
            return;
        }

        const connection = this.peer.connect(peerId);
        connection.on('open', () => {
            console.log('Connected to ' + peerId);
            this.addConnection(connection, callbacks);
        });
    }

    addConnection(connection, { onData }) {
        this.connections.set(connection.peer, connection);
        connection.on('data', data => {
            if (onData) onData(data);
        });

        connection.on('close', () => {
            console.log('Connection with ' + connection.peer + ' closed');
            this.connections.delete(connection.peer);
        });
    }

    sendMessage(message) {
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(message);
            }
        });
    }
}