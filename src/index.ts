import Tray from 'trayicon';
import icon from "./images/icon.png" with { type: "file" };
import { file, spawn, spawnSync } from "bun";
import { settings, reloadSettings } from "./settings.ts";
import { SocketManager } from "./socketConn.ts";
import SocketEvent from './socketEvent.ts';
import {Notification} from "./notifier.ts"


let trayRef: Tray | undefined;
const iconArrayBuffer = await file(icon).arrayBuffer();
const iconBuffer = Buffer.from(iconArrayBuffer);
const events: SocketEvent[] = [
    new SocketEvent("knock", (data) => {
        console.log("Knock received", data);
        if(data.username === settings.username) return;

        Notification("Knock knock!", `${data.message}`, ["Okie!"], (response, metadata) => {});
    }),
    new SocketEvent("connection", (data) => {
        console.log("Connection event", data);
    })
];
const socket = new SocketManager(events);

socket.connectSocket();
Tray.create({ icon: iconBuffer, title: "Knoknok", action: () => { socket.connectSocket() } }, async function (tray) {
    trayRef = tray;
    await renderTray(trayRef);
});
async function renderTray(tray: Tray) {
    //Send a knock
    let knockOption = tray.item("Knock knock!", {
        disabled: !socket.isReady,
        action: () => {
            if (!socket.isReady) {
                socket.connectSocket();
            }

            console.log('Knocking...');
            socket.send("knock", { username: settings.username, message: settings.customMessage, id: Date.now()});

        }
    });
    //Username display
    let usernameDisplay = tray.item(`User: ${settings.username}`, {
        disabled: true
    });
    //Connection display
    let connectionDisplay = tray.item(`Status: ${socket.isReady ? "Connected" : "Disconnected"}`, {
        disabled: true
    });
    //Settings button
    let settingsOption = tray.item("Settings", {
        action: async () => {
            const proc = await spawn([`${process.env.LOCALAPPDATA}/Microsoft/WindowsApps/Notepad.exe`, `settings.json`], {
                onExit: async () => {
                    console.log("Updating settings");
                    //reload settings and redraw tray
                    const oldSettings = settings;
                    await reloadSettings();

                    if (oldSettings.serverUrl !== settings.serverUrl) {
                        console.log("Reconnecting socket");
                        socket.closeSocket();
                        socket.connectSocket();
                    }

                    console.log("Redrawing tray");
                    await renderTray(tray);
                }
            });
        }
    });

    //Quit button
    let quit = tray.item("Quit", {
        action: () => { tray.kill(), socket.closeSocket() }
    });

    tray.setMenu(knockOption, usernameDisplay, connectionDisplay, settingsOption, tray.separator(), quit);
}

