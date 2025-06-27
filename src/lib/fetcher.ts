import axios from "axios";
import githubAxios from "@/lib/axios";

export const githubFetcher = (url: string) => githubAxios.get(url).then((res) => res.data);
export const apiFetcher = (url: string) => axios.get(url).then((res) => res.data);
