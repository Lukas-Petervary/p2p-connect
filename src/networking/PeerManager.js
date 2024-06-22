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
            this.sendHandshake(connection);
        });
    }

    addConnection(connection, { onData }) {
        this.connections.set(connection.peer, connection);
        connection.on('data', data => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === 'handshake') {
                console.log('Handshake received from ' + connection.peer);
                this.handleHandshake(parsedData.peerId, connection.peer);
            } else if (parsedData.type === 'message') {
                if (onData) onData(parsedData.message);
            }
        });

        connection.on('close', () => {
            console.log('Connection with ' + connection.peer + ' closed');
            this.connections.delete(connection.peer);
        });
    }

    sendHandshake(connection) {
        const handshakePacket = JSON.stringify({ type: 'handshake', peerId: this.peerId });
        connection.send(handshakePacket);
    }

    handleHandshake(peerId, fromPeerId) {
        if (!this.connections.has(peerId) && peerId !== this.peerId) {
            console.log('Connecting to new peer from handshake: ' + peerId);
            this.connectToPeer(peerId, {
                onData: data => appendMessage(data)
            });
        }
        // Forward the handshake to other connections except the sender and the new peer
        this.connections.forEach((conn, id) => {
            if (id !== fromPeerId && id !== peerId) {
                const handshakePacket = JSON.stringify({ type: 'handshake', peerId });
                conn.send(handshakePacket);
            }
        });
    }

    sendMessage(message) {
        const messagePacket = JSON.stringify({ type: 'message', message: this.peerId+': '+message });
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(messagePacket);
            }
        });
    }
}