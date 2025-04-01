import { create } from "zustand";

interface RepositoryBranchState {
  repository_branch: any[];
  setRepositoryBranch: (branches: any[]) => void;
}

export const useRepositoryBranchStore = create<RepositoryBranchState>((set) => ({
  repository_branch: [],

  setRepositoryBranch: (branches) => set({ repository_branch: branches }),
}));
