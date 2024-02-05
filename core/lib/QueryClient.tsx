import React, { FC, PropsWithChildren, useState } from "react";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/config/app.config";

const QueryClient: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new ReactQueryClient(QUERY_CONFIG));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClient;
