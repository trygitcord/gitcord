import { create } from "zustand";

interface RepositoryContributorsState {
  repository_contributors: any[];
  setRepositoryContributors: (contributors: any[]) => void;
}

export const useRepositoryContributorsStore = create<RepositoryContributorsState>((set) => ({
  repository_contributors: [],

  setRepositoryContributors: (contributors) => set({ repository_contributors: contributors }),
}));
