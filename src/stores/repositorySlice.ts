import { create } from "zustand";
import { createClient } from "@/utils/client";

interface RepositoryState {
  repository: any[];
  loading: boolean;
  error: string | null;
  fetchRepository: () => Promise<void>;
}

export const useRepositoryStore = create<RepositoryState>((set) => ({
  repository: [],
  loading: false,
  error: null,

  fetchRepository: async () => {
    const supabase = createClient();
    const { data: loginedUser, error } = await supabase.auth.getUser();

    if (error || !loginedUser?.user) {
      console.log('Repository fetch error:', error || 'No repository found.');
      set({ error: 'No repository found.', loading: false });
      return;
    }

    const username = loginedUser.user.user_metadata?.user_name;

    if (!username) {
      set({ error: 'GitHub username not found', loading: false });
      return;
    }

    try {
      const req = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await req.json();
      set({ repository: data, loading: false, error: null });
    } catch (err) {
      set({ error: 'Error fetching repositories', loading: false });
    }
  }
}));
