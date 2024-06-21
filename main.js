// Check if Peer ID is already stored in local storage
let peerId = localStorage.getItem('peerId');

if (!peerId) {
    // Generate a new Peer ID if not already stored
    peerId = Math.random().toString(36).substring(7); // Generate a random ID (example)
    localStorage.setItem('peerId', peerId); // Store the Peer ID in local storage
}

const peer = new Peer(peerId); // Use the stored Peer ID

let conn = null;

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    document.getElementById('connection-id').textContent = id; // Display connection ID
});

peer.on('connection', function(connection) {
    console.log('Incoming connection from ' + connection.peer);
    conn = connection;

    conn.on('data', function(data) {
        appendMessage(data);
    });

    conn.on('close', function() {
        console.log('Connection with ' + conn.peer + ' closed');
        conn = null;
    });
});

document.getElementById('send-btn').addEventListener('click', function() {
    const message = document.getElementById('message').value.trim();
    document.getElementById('message').value = '';

    if (!conn || !conn.open) {
        const destPeerId = document.getElementById('peer-id-input').value.trim();
        if (!destPeerId) {
            alert('Enter destination peer ID');
            return;
        }

        conn = peer.connect(destPeerId);
        conn.on('open', function() {
            conn.send(peerId + ': ' + message);
            appendMessage('Sent: ' + message);
        });
        conn.on('data', function(data) {
            appendMessage(data);
        });
    } else {
        conn.send(peerId + ': ' + message);
        appendMessage('Sent: ' + message);
    }
});

function appendMessage(message) {
    const messageElem = document.createElement('div');
    messageElem.textContent = message;
    document.getElementById('messages').appendChild(messageElem);
}