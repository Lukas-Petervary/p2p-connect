import { Peer } from "https://esm.sh/peerjs@1.5.4?bundle-deps";

const peer = new Peer(); // Create a new Peer instance

// Display the generated Peer ID (Friend Code) in the HTML
peer.on('open', (id) => {
    document.getElementById('ip-address').textContent = id;
});

// Handle errors when attempting to generate Peer ID
peer.on('error', (err) => {
    console.error('PeerJS error:', err);
    alert('PeerJS encountered an error. Please check console for details.');
});

document.getElementById('create-answer').addEventListener('click', () => {
    const friendId = document.getElementById('answer').value.trim();
    if (friendId === '') {
        alert('Please enter a valid friend ID to connect.');
        return;
    }
    
    const conn = peer.connect(friendId);
    setupDataChannel(conn); // Setup data channel for sending messages
});

function setupDataChannel(conn) {
    conn.on('open', () => {
        console.log('Connection established');
        conn.on('data', (data) => {
            console.log('Received:', data);
        });

        // Send messages
        document.getElementById('send-msg').addEventListener('click', () => {
            const message = document.getElementById('message').value;
            conn.send(message); // Send message over the data connection
        });
    });

    conn.on('error', (err) => {
        console.error('Connection error:', err);
        alert('Connection error. Please check console for details.');
    });
}

// Initialize peerConnection as an RTCPeerConnection instance
const peerConnection = new RTCPeerConnection();

document.getElementById('set-answer').addEventListener('click', async () => {
    try {
        const sdpAnswer = document.getElementById('answer').value.trim(); // Assuming 'answer' is directly usable as SDP
        const sessionDescription = {
            type: 'answer',
            sdp: sdpAnswer
        };
        await peerConnection.setRemoteDescription(sessionDescription); // Use 'sessionDescription' directly
    } catch (error) {
        console.error('Error setting remote description:', error);
        alert('Error setting remote description. Please check console for details.');
    }
});
