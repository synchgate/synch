import { type DefaultOptions, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false, // Disables automatic refetching when browser window is focused
    retry: false, // Disables automatic retries on failed requests
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
