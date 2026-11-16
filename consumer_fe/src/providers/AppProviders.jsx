import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { POSITIONS, setUpNotifications } from 'reapop';
import { store, persistor } from '../store';
import NotificationsHost from '../components/notifications/NotificationsHost';

setUpNotifications({
  defaultProps: {
    position: POSITIONS.topRight,
    dismissible: true,
    dismissAfter: 5000,
    showDismissButton: true,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.status === 429) return false;
        return failureCount < 1;
      },
    },
  },
});

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
          <NotificationsHost />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
