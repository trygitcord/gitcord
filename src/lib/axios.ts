import axios from 'axios';
import { getSession } from 'next-auth/react';

const githubAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com',
});

githubAxios.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
});

export default githubAxios;
