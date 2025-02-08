import Tray from 'trayicon';
import * as fs from 'fs';
import * as os from 'os';

const username = os.userInfo().username;


Tray.create(function (tray) {
    tray.setTitle("Knoknok")
    tray.setIcon(fs.readFileSync('./images/bell.png'));

    let knockOption = tray.item("Knock knock!", {
        action: () => {
            console.log('Knocking...');
            
        }
    });
    let userNameOption = tray.item(username, {
        disabled: true,
    });
    let quit = tray.item("Quit", {
        action: () => {tray.kill()}
    });

    tray.setMenu(knockOption, userNameOption, tray.separator(), quit);
});