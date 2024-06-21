const ip_to_hex = (ipv4) => {
    const octets = ipv4.split('.').map(Number);
    const hexParts = octets.map(octet => octet.toString(16).padStart(2, '0'));

    return hexParts.join('');
}

const hex_to_ip = (hexHash) => {
    const octets = [];
    for (let i = 0; i < hexHash.length; i += 2) {
        const part = hexHash.slice(i, i + 2);
        octets.push(parseInt(part, 16));
    }
    return octets.join('.');
}

let ipv4 = null;
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        ipv4 = data.ip;
    })
    .catch(error => {
        console.error('Error fetching IP address:', error);
        document.getElementById('ip-address').textContent = 'Unable to fetch IP address';
    }).finally(() => {
    document.getElementById('ip-address').textContent = ipv4 + " => " + ip_to_hex(ipv4);
});


/*##################################
#            WEBRTC CODE           #
##################################*/
const peer = new Peer(); // No need to specify an ID, PeerJS will generate one

peer.on('open', function(id) {
    document.getElementById('connect-id').textContent = id;
    console.log('My peer ID is: ' + id);
});

let conn = null;

peer.on('connection', function(connection) {
    console.log('Incoming connection from ' + connection.peer);
    conn = connection;

    conn.on('data', function(data) {
        appendMessage('Received: ' + data);
    });

    conn.on('close', function() {
        console.log('Connection with ' + conn.peer + ' closed');
        conn = null;
    });
});

document.getElementById('send-btn').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    document.getElementById('message').value = '';

    if (!conn) {
        const destPeerId = document.getElementById('peer-id-input').value.trim();
        if (!destPeerId) {
            alert('Enter destination peer ID');
            return;
        }

        conn = peer.connect(destPeerId);
        conn.on('open', function() {
            conn.send(message);
            appendMessage('Sent: ' + message);
        });
    } else {
        conn.send(message);
        appendMessage('Sent: ' + message);
    }
});

function appendMessage(message) {
    const messageElem = document.createElement('div');
    messageElem.textContent = message;
    document.getElementById('messages').appendChild(messageElem);
}
