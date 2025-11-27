import axios from "axios";

export type FakeStoreUser = {
    id: number;
    email: string;
    username: string;
    name: { firstname: string; lastname: string };
    phone: string;
};

const api = axios.create({
    baseURL: "https://fakestoreapi.com",
    timeout: 12000,
});

export async function getUserById(id: number): Promise<FakeStoreUser> {
    const { data } = await api.get<FakeStoreUser>(`/users/${id}`);
    return data;
}

export async function listUsers(): Promise<FakeStoreUser[]> {
    const { data } = await api.get<FakeStoreUser[]>("/users");
    return data;
}

export const FAKESTORE_USERS_COUNT = 10;
