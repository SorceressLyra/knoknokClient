import { file } from 'bun';
import * as os from 'os';

//Internal;

const settingsPath = 'settings.json';
const defaultSettings: { [key: string]: any } = {
    "username": os.userInfo().username,
    "serverUrl": "http://localhost:3000",
    "customMessage": "{user} loves you!"
};

async function loadSettings() {
    const settingsFile = file(settingsPath);
    
    if (await settingsFile.exists()) {
        
        const settings: { [key: string]: any } = JSON.parse(await settingsFile.text());

        //Add any missing keys and save it to the settings file
        for (const key in defaultSettings) {
            if (!(key in settings)) {
            settings[key] = defaultSettings[key];
            }
        }
        await Bun.write(settingsPath, JSON.stringify(settings, null, 4));

        settings.customMessage = settings.customMessage.replace("{user}", settings.username);

        //Return the settings
        return settings;

    } else {
        await Bun.write(settingsPath, JSON.stringify(defaultSettings, null, 4));
        return await loadSettings();
    }
}


// Exports
export let settings = await loadSettings();

export async function reloadSettings() {
    settings = await loadSettings();
}

