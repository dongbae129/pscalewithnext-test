import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default MyApp;
