import PeerManager from './src/networking/PeerManager.js';
import MessageService from './src/networking/MessageService.js';

const peerManager = new PeerManager();
const messageService = new MessageService();

peerManager.initialize({
    onData: data => messageService.appendMessage(data)
});

messageService.handleSendButton(peerManager);
messageService.handleConnectButton(peerManager);
