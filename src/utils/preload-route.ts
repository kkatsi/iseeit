const routes = {
  game: () => import('@/features/game/host/game'),
  connect: () => import('@/features/client-connect/pages/connect'),
  play: () => import('@/features/game/client/play'),
} as const;

export const preloadRoute = (route: keyof typeof routes) => routes[route]();
