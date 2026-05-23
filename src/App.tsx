import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Layout } from '@/components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import appConfig from './configs/app.config';
import { mockServer } from './mock/mock';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppSelector } from '@/store';

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
  const locale = useAppSelector((state) => state.locale.currentLang);
  const dir = locale.toLowerCase().startsWith('fa') ? 'rtl' : 'ltr';

  /**
   * Set enableMock(Default true) to true at configs/app.config.js
   * If you wish to enable mock api
   */
  if (appConfig.enableMock) {
    mockServer();
  }

  return (
    <DirectionProvider key={dir} initialDirection={dir} detectDirection={false}>
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
    </DirectionProvider>
  );
}
