import { create } from "zustand";

interface RepositoryLanguagesState {
  repository_languages: any[];
  loading: boolean;
  error: string | null;
  fetchRepositoryLanguage: (projectName: string) => Promise<void>;
}

export const useRepositoryLanguagesStore = create<RepositoryLanguagesState>((set) => ({
  repository_languages: [],
  loading: false,
  error: null,

  fetchRepositoryLanguage: async (projectName) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`https://api.github.com/repos/{username}/${projectName}/languages`);
      const data = await response.json();
      set({ repository_languages: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
