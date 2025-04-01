import { create } from "zustand";

interface OrganizationIssuesState {
  organizations_issues: any[];
  setOrganizationIssues: (issues: any[]) => void;
}

export const useOrganizationIssuesStore = create<OrganizationIssuesState>((set) => ({
  organizations_issues: [],
  
  setOrganizationIssues: (issues) => set({ organizations_issues: issues }),
}));
