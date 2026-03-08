import { http } from '@/api/http';
import type { ResponseAPI } from '@/types/api.p';

export type AuthenticatedUser = {
    id: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    emailVerified: boolean;
};

export type AuthSession = {
    accessToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
    user: AuthenticatedUser;
};

export async function authenticateWithGoogle(idToken: string) {
    const { data } = await http.post<ResponseAPI<AuthSession>>('/api/v1/auth/login', {
        tokenId: idToken,
        type: 'google'
    });

    return data.data;
}

export async function authenticateWithVanillaAccount(username: string, password: string) {
    const { data } = await http.post<ResponseAPI<AuthSession>>('/api/v1/auth/login', {
        username,
        password,
        type: 'email_password'
    });

    return data.data;
}

export async function getCurrentUser() {
    const { data } = await http.get<ResponseAPI<AuthenticatedUser>>('/api/v1/auth/me');

    return data.data;
}
