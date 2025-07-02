import axios from "axios";
import githubAxios from "@/lib/axios";

export const githubFetcher = (url: string) => {
  console.log("GitHub API Request:", url);
  return githubAxios
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("GitHub API Error:", {
        url,
        error: err.response?.data || err.message,
      });
      throw err;
    });
};
export const apiFetcher = (url: string) =>
  axios.get(url).then((res) => res.data);
