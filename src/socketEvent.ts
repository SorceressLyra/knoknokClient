class SocketEvent {
    onEvent: ((event: any) => void);
    channel: string;
    
    constructor(channel: string, onEvent: (event: any) => void = (event) => {}) {
        this.channel = channel;
        this.onEvent = onEvent;
    }
    
};

export default SocketEvent;