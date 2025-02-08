declare module 'trayicon' {
    interface Tray {
        action: () => void;
        setTitle(title: string): void;
        setIcon(icon: Buffer): void;
        notify(title: string, message: string): void;
        item(label: string, options?: { action?: () => void; disabled?: boolean }): TrayItem;
        separator(): TrayItem;
        setMenu(...items: TrayItem[]): void;
        kill(): void;
    }

    interface TrayItem {
        label: string;
        checked?: boolean;
        disabled?: boolean;
        bold?: boolean;
        action?: () => void;
    }

    const Tray: {
        create(options?: { icon?: Buffer; title?: string; action?: () => void; useTempDir?: boolean }, readyCb?: (tray: Tray) => void): Promise<Tray>;
    };

    export default Tray;
}

