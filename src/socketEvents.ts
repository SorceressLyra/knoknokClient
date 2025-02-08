class SocketEvents {
    onConnect: (() => void) | undefined;
    onErr: (() => void) | undefined;
    onClose: (() => void) | undefined;
    onMessage: ((event: MessageEvent) => void) | undefined;

    constructor({onConnect, onErr, onClose, onMessage}: {onConnect?: () => void, onErr?: () => void, onClose?: () => void, onMessage?: (event: MessageEvent) => void} = {}) {
        this.onConnect = onConnect;
        this.onErr = onErr;
        this.onClose = onClose;
        this.onMessage = onMessage;
    }
    
};

export default SocketEvents;