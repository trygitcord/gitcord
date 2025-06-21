"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserProfile } from "@/stores/user/userProfileSlice";
import { userReposSlice } from "@/stores/user/reposSlice";
import { userEventsSlice } from "@/stores/user/eventsSlice";
import { userOrgsSlice } from "@/stores/user/orgsSlice";
import { orgActivitySlice } from "@/stores/org/activitySlice";
import { orgLanguagesSlice } from "@/stores/org/languagesSlice";
import { repoActivitySlice } from "@/stores/repo/activitySlice";

export function useStoreCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Cleanup on route change
    return () => {
      // Reset user stores
      const { resetData: resetProfile } = getUserProfile.getState();
      const { resetData: resetRepos } = userReposSlice.getState();
      const { resetData: resetEvents } = userEventsSlice.getState();
      const { resetData: resetOrgs } = userOrgsSlice.getState();

      // Reset org stores
      const { resetData: resetOrgActivity } = orgActivitySlice.getState();
      const { resetData: resetOrgLanguages } = orgLanguagesSlice.getState();

      // Reset repo stores
      const { resetData: resetRepoActivity } = repoActivitySlice.getState();

      // Call all reset functions
      if (resetProfile) resetProfile();
      if (resetRepos) resetRepos();
      if (resetEvents) resetEvents();
      if (resetOrgs) resetOrgs();
      if (resetOrgActivity) resetOrgActivity();
      if (resetOrgLanguages) resetOrgLanguages();
      if (resetRepoActivity) resetRepoActivity();
    };
  }, [pathname]);
}
