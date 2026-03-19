interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
    clientId?: string;
}

interface GoogleAccountsId {
    initialize(config: { client_id: string; callback: (response: GoogleCredentialResponse) => void; cancel_on_tap_outside?: boolean; [key: string]: unknown }): void;
    renderButton(
        parent: HTMLElement,
        options: {
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
            width?: number;
            [key: string]: unknown;
        }
    ): void;
    prompt(notification?: (n: unknown) => void): void;
    cancel(): void;
    disableAutoSelect(): void;
}

interface Window {
    google?: {
        accounts?: {
            id: GoogleAccountsId;
        };
    };
}
