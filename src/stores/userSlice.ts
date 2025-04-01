import { create } from "zustand";
import { createClient } from "@/utils/client";

interface UserState {
  userProfile: any[];
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userProfile: [],
  loading: false,
  error: null,

  fetchUser: async () => {
    const supabase = createClient();
    const { data: loginedUser, error } = await supabase.auth.getUser();

    if (error || !loginedUser?.user) {
      console.log('User fetch error:', error || 'No user found');
      set({ error: 'User not found', loading: false });
      return;
    }

    const username = loginedUser.user.user_metadata?.user_name;

    if (!username) {
      set({ error: 'GitHub username not found', loading: false });
      return;
    }

    try {
      const req = await fetch(`https://api.github.com/users/${username}`);
      const data = await req.json();
      set({ userProfile: data, loading: false, error: null });
    } catch (err) {
      set({ error: 'Error fetching user profile', loading: false });
    }
  }
}));
