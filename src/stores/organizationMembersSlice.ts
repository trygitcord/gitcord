import { create } from "zustand";
import { createClient } from "@/utils/client";

interface OrganizationMembersState {
  organizations_members: { [key: string]: any[] };
  loading: boolean;
  error: string | null;
  fetchOrganizationMembers: (organizationName: string) => Promise<void>;
}

export const useOrganizationMembersStore = create<OrganizationMembersState>((set) => ({
  organizations_members: {},
  loading: false,
  error: null,

  fetchOrganizationMembers: async (organizationName) => {
    set({ loading: true, error: null });
    try {
      const supabase = createClient();
      const { data: loginedUser, error } = await supabase.auth.getUser();

      if (error || !loginedUser?.user) {
        throw new Error("No repository found.");
      }

      const username = loginedUser.user.user_metadata?.user_name;
      if (!username) {
        throw new Error("GitHub username not found");
      }

      const req = await fetch(`https://api.github.com/orgs/${organizationName}/members`);
      const data = await req.json();
      set((state) => ({
        organizations_members: { ...state.organizations_members, [organizationName]: data },
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || "Error" });
    }
  },
}));