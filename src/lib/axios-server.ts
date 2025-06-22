import axios from 'axios';

const githubAxiosServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
    }
});

// Server-side için token parametreli helper function
export const createGithubRequest = (accessToken?: string) => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        }
    });

    return instance;
};

export default githubAxiosServer;
