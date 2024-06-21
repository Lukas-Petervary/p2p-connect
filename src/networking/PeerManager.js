export default class PeerManager {
    constructor() {
        this.peerId = localStorage.getItem('peerId') || this.generatePeerId();
        localStorage.setItem('peerId', this.peerId);
        this.peer = new Peer(this.peerId);
        this.connections = []; // List of all connections
    }

    generatePeerId() {
        return Math.random().toString(36).substring(7);
    }

    initialize(callbacks) {
        this.peer.on('open', id => {
            console.log('My peer ID is: ' + id);
            document.getElementById('connection-id').textContent = id;
        });

        this.peer.on('connection', connection => {
            console.log('Incoming connection from ' + connection.peer);
            this.addConnection(connection, callbacks);
        });
    }

    connectToPeer(peerId, callbacks) {
        const connection = this.peer.connect(peerId);
        connection.on('open', () => {
            console.log('Connected to ' + peerId);
            this.addConnection(connection, callbacks);
        });
    }

    addConnection(connection, { onData }) {
        this.connections.push(connection);
        connection.on('data', data => {
            if (onData) onData(data);
        });

        connection.on('close', () => {
            console.log('Connection with ' + connection.peer + ' closed');
            this.connections = this.connections.filter(conn => conn !== connection);
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