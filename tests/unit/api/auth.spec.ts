import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ResponseAPI } from '@/types/api.p';

vi.mock('@/api/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

import { http } from '@/api/http';
import { authenticateWithGoogle, authenticateWithVanillaAccount, getCurrentUser } from '@/api/auth';
import type { AuthSession, AuthenticatedUser } from '@/api/auth';

const mockHttp = {
    get: vi.mocked(http.get),
    post: vi.mocked(http.post)
};

function makeUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
    return {
        id: 'u1',
        email: 'test@example.com',
        name: 'Test User',
        picture: null,
        emailVerified: false,
        ...overrides
    };
}

function makeSession(overrides: Partial<AuthSession> = {}): AuthSession {
    return {
        accessToken: 'tok123',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: makeUser(),
        ...overrides
    };
}

describe('authenticateWithGoogle', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/auth/login with tokenId and type google', async () => {
        const session = makeSession();
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        const result = await authenticateWithGoogle('google-id-token');

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/auth/login', {
            tokenId: 'google-id-token',
            type: 'google'
        });
        expect(result).toEqual(session);
    });

    it('returns accessToken and tokenType from session', async () => {
        const session = makeSession({ accessToken: 'goog-tok-abc', expiresIn: 7200 });
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        const result = await authenticateWithGoogle('any-token');

        expect(result.accessToken).toBe('goog-tok-abc');
        expect(result.tokenType).toBe('Bearer');
        expect(result.expiresIn).toBe(7200);
    });

    it('includes user data in the returned session', async () => {
        const user = makeUser({ id: 'u42', email: 'google@user.com', emailVerified: true });
        const session = makeSession({ user });
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        const result = await authenticateWithGoogle('token');

        expect(result.user).toEqual(user);
    });
});

describe('authenticateWithVanillaAccount', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/auth/login with username, password and email_password type', async () => {
        const session = makeSession();
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        await authenticateWithVanillaAccount('user@example.com', 'secret');

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/auth/login', {
            username: 'user@example.com',
            password: 'secret',
            type: 'email_password'
        });
    });

    it('returns the auth session from the response', async () => {
        const session = makeSession({ accessToken: 'vanilla-tok' });
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        const result = await authenticateWithVanillaAccount('user@example.com', 'secret');

        expect(result).toEqual(session);
    });

    it('passes different credentials correctly', async () => {
        const session = makeSession();
        mockHttp.post.mockResolvedValue({ data: { data: session } as ResponseAPI<AuthSession> });

        await authenticateWithVanillaAccount('admin@test.com', 'pass456');

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/auth/login', {
            username: 'admin@test.com',
            password: 'pass456',
            type: 'email_password'
        });
    });
});

describe('getCurrentUser', () => {
    beforeEach(() => {
        mockHttp.get.mockClear();
    });

    it('calls GET /api/v1/auth/me', async () => {
        const user = makeUser();
        mockHttp.get.mockResolvedValue({ data: { data: user } as ResponseAPI<AuthenticatedUser> });

        await getCurrentUser();

        expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/auth/me');
    });

    it('returns the authenticated user from the response', async () => {
        const user = makeUser({ id: 'u99', email: 'admin@example.com', name: 'Admin', emailVerified: true });
        mockHttp.get.mockResolvedValue({ data: { data: user } as ResponseAPI<AuthenticatedUser> });

        const result = await getCurrentUser();

        expect(result).toEqual(user);
    });

    it('returns user with null picture when not set', async () => {
        const user = makeUser({ picture: null });
        mockHttp.get.mockResolvedValue({ data: { data: user } as ResponseAPI<AuthenticatedUser> });

        const result = await getCurrentUser();

        expect(result.picture).toBeNull();
    });

    it('returns user with picture URL when provided', async () => {
        const user = makeUser({ picture: 'https://cdn.example.com/avatar.jpg' });
        mockHttp.get.mockResolvedValue({ data: { data: user } as ResponseAPI<AuthenticatedUser> });

        const result = await getCurrentUser();

        expect(result.picture).toBe('https://cdn.example.com/avatar.jpg');
    });
});
