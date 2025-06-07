export interface sliceTypes {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (query?: string) => Promise<void>;
}
