import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { theme } from './theme';
// import { Layout } from '@/components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import appConfig from './configs/app.config';
import { mockServer } from './mock/mock';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './layouts/Layout';
import 'dayjs/locale/fa';

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
    <DirectionProvider initialDirection='rtl' detectDirection={false}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <DatesProvider settings={{ locale: 'fa', firstDayOfWeek: 6, weekendDays: [5] }}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Notifications />
                <Layout />
              </BrowserRouter>
            </QueryClientProvider>
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}
