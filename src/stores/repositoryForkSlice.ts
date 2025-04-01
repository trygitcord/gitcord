import { create } from "zustand";

interface RepositoryForkState {
  repository_fork: any[];
  setRepositoryFork: (forks: any[]) => void;
}

export const useRepositoryForkStore = create<RepositoryForkState>((set) => ({
  repository_fork: [],

  setRepositoryFork: (forks) => set({ repository_fork: forks }),
}));
