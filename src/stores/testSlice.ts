import { create } from "zustand";

export const playlistStore = create<any>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://test.com`,
        {
          method: "GET",
        //   headers: {
        //     Authorization: `Bearer ${token}`, 
        //     "Content-Type": "application/json",
        //   },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch!`);
      }

      const data = await response.json();
      set({ data, loading: false }); 
    } catch (error: any) {
      set({ error: error.message, loading: false }); 
    }
  },
}));
