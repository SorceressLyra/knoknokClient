declare module 'trayicon' {
    interface Tray {
        setTitle(title: string): void;
        setIcon(icon: Buffer): void;
        item(label: string, options?: { action?: () => void; disabled?: boolean }): TrayItem;
        separator(): TrayItem;
        setMenu(...items: TrayItem[]): void;
        kill(): void;
    }

    interface TrayItem {}

    const Tray: {
        create(callback: (tray: Tray) => void): void;
    };

    export default Tray;
}