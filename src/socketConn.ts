import { settings } from "./settings";
import type SocketEvents from "./socketEvents";


export class SocketManager {

    private _socket: WebSocket | undefined;
    private _events: SocketEvents | undefined;

    public get isReady(): boolean {
        return this._socket?.readyState === WebSocket.OPEN;
    }

    constructor(events?: SocketEvents) {
        this._events = events;
    }

    connectSocket() {

        if (this._socket && this._socket.readyState !== WebSocket.CLOSED)
            return;

        this._socket = new WebSocket(settings.serverUrl);
        this.bindEvents(this._events);
    }

    bindEvents(events?: SocketEvents, clear?: boolean) {
        if (clear) {
            this._socket?.removeAllListeners("open");
            this._socket?.removeAllListeners("close");
            this._socket?.removeAllListeners("error");
            this._socket?.removeAllListeners("message");
        }

        if (!this._socket) {
            throw new Error("Socket not initialized");
        }
        
        this._socket.addEventListener("open", () => {
            console.log("Socket connected");
            
            if (events && events.onConnect)
                events?.onConnect();
        });
        this._socket.addEventListener("close", () => {
            console.log("Socket closed");

            if (events && events.onClose)
                events?.onClose();
        });
        this._socket.addEventListener("error", () => {
            console.log("Socket error");

            if (events && events.onErr)
                events?.onErr();
        });

        this._socket.addEventListener("message", (event) => {

            if (events && events.onMessage)
                events?.onMessage(event);
        });
    }

    send(message: string) {
        if (!this._socket) {
            throw new Error("Socket not initialized");
        }
        this._socket.send(message);
    }

    sendJson(json: any) {
        if (!this._socket) {
            throw new Error("Socket not initialized");
        }
        this._socket.send(JSON.stringify(json));
    }

    closeSocket() {
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
        }
    }
}
