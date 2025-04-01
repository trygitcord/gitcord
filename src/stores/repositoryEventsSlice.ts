import { create } from "zustand";

interface RepositoryEventsState {
  repository_events: any[];
  setRepositoryEvents: (events: any[]) => void;
}

export const useRepositoryEventsStore = create<RepositoryEventsState>((set) => ({
  repository_events: [],

  setRepositoryEvents: (events) => set({ repository_events: events }),
}));
