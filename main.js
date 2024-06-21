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
let peerConnection;
let dataChannel;

document.getElementById('create-offer').addEventListener('click', async () => {
    peerConnection = new RTCPeerConnection();

    dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = () => console.log('Data channel is open');
    dataChannel.onmessage = (event) => alert('Message received: ' + event.data);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // ICE candidate generated
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById('offer').value = JSON.stringify(peerConnection.localDescription);
});

document.getElementById('create-answer').addEventListener('click', async () => {
    const offer = JSON.parse(document.getElementById('offer').value);
    peerConnection = new RTCPeerConnection();

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => alert('Message received: ' + event.data);
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // ICE candidate generated
        }
    };

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    document.getElementById('answer').value = JSON.stringify(peerConnection.localDescription);
});

document.getElementById('set-answer').addEventListener('click', async () => {
    const answer = JSON.parse(document.getElementById('answer').value);
    await peerConnection.setRemoteDescription(answer);
});

document.getElementById('send-msg').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    dataChannel.send(message);
});