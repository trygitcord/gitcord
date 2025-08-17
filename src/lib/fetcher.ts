import axios from "axios";
import githubAxios from "@/lib/axios";

export const githubFetcher = (url: string) => {
  return githubAxios
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const apiFetcher = (url: string) =>
  axios.get(url).then((res) => res.data);
