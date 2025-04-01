import { create } from "zustand";
import { createClient } from "@/utils/client";

interface UserState {
  userEvent: any[];
  loading: boolean;
  error: string | null;
  fetchUserEvents: () => Promise<void>;
}

export const useUserEventsStore = create<UserState>((set) => ({
  userEvent: [],
  loading: false,
  error: null,

  fetchUserEvents: async () => {
    const supabase = createClient();
    const { data: loginedUser, error } = await supabase.auth.getUser();

    if (error || !loginedUser?.user) {
      console.log('User events fetch error:', error || 'No user events found');
      set({ error: 'User events not found', loading: false });
      return;
    }

    const username = loginedUser.user.user_metadata?.user_name;

    if (!username) {
      set({ error: 'GitHub username not found', loading: false });
      return;
    }

    try {
      const req = await fetch(`https://api.github.com/users/${username}/events`);
      const data = await req.json();
      set({ userEvent: data, loading: false, error: null });
    } catch (err) {
      set({ error: 'Error fetching user events', loading: false });
    }
  }
}));
