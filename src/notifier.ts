import notifier, { type NotificationMetadata } from 'node-notifier';
import image from "./images/kirby.gif" with { type: "file" };


export function Notification(title: string, message: string, actions?: string | string[],actionCallback?: (response: String, metadata: NotificationMetadata | undefined) => void) {
    
    notifier.notify({
        title: title,
        message: message,
        icon: image,
        wait: true,
        actions: actions,
        sound: "Notification.Looping.Alarm2",
    }, function (err, response, metadata) {
        if (err) {
            console.error(err);
            return;
        }
        actionCallback?.(response, metadata);
    });
}
