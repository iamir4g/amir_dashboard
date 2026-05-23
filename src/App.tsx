import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Layout } from '@/components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import appConfig from './configs/app.config';
import { mockServer } from './mock/mock';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default function App() {
  /**
   * Set enableMock(Default true) to true at configs/app.config.js
   * If you wish to enable mock api
   */
  if (appConfig.enableMock) {
    mockServer();
  }

  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Notifications />
            <Layout />
          </BrowserRouter>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
