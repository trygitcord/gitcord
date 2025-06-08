export interface sliceTypes {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (query?: string, query2?: string) => Promise<void>;
}

//   https://api.github.com/users/OWNER/repos
//   https://api.github.com/users/OWNER/orgs
//   https://api.github.com/users/OWNER/events/public

//   https://api.github.com/repos/OWNER/REPO/commits
//   https://api.github.com/repos/OWNER/REPO/issues
//   https://api.github.com/repos/OWNER/REPO/pulls
//   https://api.github.com/repos/OWNER/REPO/activity
//   https://api.github.com/repos/OWNER/REPO/languages
//   https://api.github.com/repos/OWNER/REPO/stats/commit_activity


//   https://api.github.com/orgs/ORG/repos
//   https://api.github.com/orgs/ORG/members
