import { create } from "zustand";

interface RepositoryPullState {
  repository_pull: any[];
  setRepositoryPull: (pulls: any[]) => void;
}

export const useRepositoryPullStore = create<RepositoryPullState>((set) => ({
  repository_pull: [],
  
  setRepositoryPull: (pulls) => set({ repository_pull: pulls }),
}));
