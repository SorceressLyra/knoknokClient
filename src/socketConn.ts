import { settings } from "./settings";
import type SocketEvent from "./socketEvent";
import { io, Socket } from "socket.io-client";

export class SocketManager {

    private _socket: Socket | undefined;
    private _events: SocketEvent[] | undefined;

    public get isReady(): boolean {
        return this._socket?.connected ?? false;
    }

    constructor(events?: SocketEvent[]) {
        this._events = events;
    }

    connectSocket() {

        if (this._socket && this._socket.connected)
            return;

        this._socket = io(settings.serverUrl);
        this.bindEvents(this._events);
    }

    bindEvents(events?: SocketEvent[], clear?: boolean) {
        
        if(clear)
            this._socket?.removeAllListeners();

        if (!this._socket) {
            throw new Error("Socket not initialized");
        }
        
        events?.forEach(event => {
            this._socket?.on(event.channel, event.onEvent);
        });
    }

    send(channel: string, message: any) {
        if (!this._socket)
            throw new Error("Socket not initialized");
        
        this._socket.emit(channel, message);
    }

    closeSocket() {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
        }
    }
}
