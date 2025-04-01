import { create } from "zustand";

interface RepositoryCommitsState {
  repository_commits: any[];
  setRepositoryCommits: (commits: any[]) => void;
}

export const useRepositoryCommitsStore = create<RepositoryCommitsState>((set) => ({
  repository_commits: [],

  setRepositoryCommits: (commits) => set({ repository_commits: commits }),
}));
