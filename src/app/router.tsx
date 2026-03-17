import AppLayout from '@/app/layouts/app-layout';
import ClientLayout from '@/app/layouts/client-layout';
import HostLayout from '@/app/layouts/host-layout';
import { paths } from '@/config/paths';
import { createBrowserRouter, RouterProvider } from 'react-router';
const convert = (m: { default: React.ComponentType }) => ({
  Component: m.default,
});

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        path: paths.host.root,
        Component: HostLayout,
        children: [
          {
            index: true,
            lazy: () => import('@/features/lobby/pages/lobby').then(convert),
          },
          {
            path: paths.host.game,
            lazy: () => import('@/features/game/host/game').then(convert),
          },
        ],
      },
      {
        path: paths.client.root,
        Component: ClientLayout,
        children: [
          {
            path: paths.client.connect,
            lazy: () =>
              import('@/features/client-connect/pages/connect').then(convert),
          },
          {
            path: paths.client.play,
            lazy: () => import('@/features/game/client/play').then(convert),
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
