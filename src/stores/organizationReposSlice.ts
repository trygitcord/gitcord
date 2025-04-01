import { create } from "zustand";

interface OrganizationReposState {
  organizations_repos: any[];
  setOrganizationRepos: (repos: any[]) => void;
}

export const useOrganizationReposStore = create<OrganizationReposState>((set) => ({
  organizations_repos: [],
  
  setOrganizationRepos: (repos) => set({ organizations_repos: repos }),
}));
