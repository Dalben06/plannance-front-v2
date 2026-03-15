import type { ResponseAPI } from '@/types/api.p';
import { http } from './http';

export type UserCreation = {
    name: string;
    email: string;
    password: string;
};

export async function createUser(user: UserCreation) {
    const { data } = await http.post<ResponseAPI<UserCreation>>('/api/v1/users', {
        email: user.email,
        password: user.password,
        name: user.name,
        type: 'email_password'
    });

    return data.data;
}
