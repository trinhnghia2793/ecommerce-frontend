import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // period which data is considered "fresh"
        gcTime: 5 * 60 * 1000, // period which cache is kept when nobody uses it   
        retry: 1,
        refetchOnWindowFocus: true, 
      },
      mutations: {
        retry: 0,  
      }
    }
  });
}
