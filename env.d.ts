/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENABLE_DEBUG?: string;
    readonly VITE_GOOGLE_CLIENT_ID?: string;
    readonly VITE_GOOGLE_API_KEY?: string;
}

type GoogleCredentialResponse = {
    credential: string;
};

type GoogleIdConfiguration = {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
};

type GoogleButtonConfiguration = {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin' | 'signup' | 'continue';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    width?: number;
    logo_alignment?: 'left' | 'center';
};

interface Window {
    google?: {
        accounts: {
            id: {
                initialize: (config: GoogleIdConfiguration) => void;
                renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
            };
        };
    };
}
