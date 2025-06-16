import { create } from "zustand";
import githubAxios from "@/lib/axios";

interface LanguagesState {
  data: { [key: string]: { [key: string]: number } };
  loading: boolean;
  error: string | null;
  fetchData: (username: string, orgName: string) => Promise<void>;
  resetData: () => void;
}

export const orgLanguagesSlice = create<LanguagesState>((set) => ({
  data: {},
  loading: false,
  error: null,
  fetchData: async (username: string, orgName: string) => {
    try {
      set({ loading: true, error: null });

      // First check if we have access to the organization
      try {
        await githubAxios.get(`https://api.github.com/orgs/${orgName}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Organization ${orgName} not found`);
        } else if (error.response?.status === 403) {
          throw new Error(`Access denied to organization ${orgName}`);
        }
        throw error;
      }

      // Get all repositories for the organization
      const reposResponse = await githubAxios.get(
        `https://api.github.com/users/${orgName}/repos?per_page=100&sort=updated`
      );

      // Fetch languages for each repository
      const languagesPromises = reposResponse.data.map(async (repo: any) => {
        try {
          const response = await githubAxios.get(
            `https://api.github.com/repos/${orgName}/${repo.name}/languages`
          );
          return { [repo.name]: response.data };
        } catch (error) {
          console.warn(`Could not fetch languages for ${repo.name}:`, error);
          return { [repo.name]: {} };
        }
      });

      const languagesResults = await Promise.all(languagesPromises);

      // Combine languages from all repositories
      const combinedLanguages = languagesResults.reduce((acc: { [key: string]: number }, curr: { [key: string]: { [key: string]: number } }) => {
        Object.values(curr).forEach((repoLangs: { [key: string]: number }) => {
          Object.entries(repoLangs).forEach(([lang, bytes]) => {
            acc[lang] = (acc[lang] || 0) + bytes;
          });
        });
        return acc;
      }, {});

      // Sort languages by total bytes
      const languageEntries = Object.entries(combinedLanguages) as [string, number][];
      const sortedLanguages = languageEntries
        .sort(([, a], [, b]) => b - a)
        .reduce((acc: { [key: string]: number }, [lang, bytes]) => {
          acc[lang] = bytes;
          return acc;
        }, {});

      set((state) => ({
        data: { ...state.data, [orgName]: sortedLanguages },
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch organization languages",
        loading: false,
      });
      throw error;
    }
  },
  resetData: () => set({ data: {}, loading: false, error: null }),
}));
