import { Component, type ReactNode } from 'react';
import {
  BrowserRouter,
  StaticRouter,
  Navigate,
  Outlet,
  useLocation,
  useRoutes,
  type RouteObject,
} from 'react-router';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { InitialDataProvider, type InitialData } from '@/lib/initial-data';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import WritingPage from '@/components/pages/WritingPage';
import ArticleDetailPage from '@/components/pages/ArticleDetailPage';
import EssaysPage from '@/components/pages/EssaysPage';
import EssayDetailPage from '@/components/pages/EssayDetailPage';
import AboutPage from '@/components/pages/AboutPage';
import ArticlePage from '@/components/pages/ArticlePage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { aiEnglishWeaknessArticle } from '@/data/ai-english-weakness-article';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "writing",
        element: <WritingPage />,
      },
      {
        path: "writing/:slug",
        element: <ArticleDetailPage />,
      },
      {
        path: "essays",
        element: <EssaysPage />,
      },
      {
        path: "essays/:slug",
        element: <EssayDetailPage />,
      },
      {
        // Blog was a duplicate listing of the same articles collection as
        // /writing — canonical index now lives at /writing, old links redirect.
        path: "blog",
        element: <Navigate to="/writing" replace />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: aiEnglishWeaknessArticle.path.slice(1),
        element: <ArticlePage />,
      },
      {
        // old URL for the same article — redirect to the canonical one
        path: "article/ai-exposed-biggest-english-weakness",
        element: <Navigate to={aiEnglishWeaknessArticle.path} replace />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

/**
 * Stands in for the data router's errorElement, which isn't available with
 * StaticRouter/BrowserRouter. Clears itself when the URL changes.
 */
class RouteErrorBoundary extends Component<{ pathname: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { pathname: string }) {
    if (this.state.error && prevProps.pathname !== this.props.pathname) {
      this.setState({ error: null });
    }
  }

  render() {
    return this.state.error ? <ErrorPage error={this.state.error} /> : this.props.children;
  }
}

function AppRoutes() {
  const { pathname } = useLocation();
  const element = useRoutes(routes);
  return <RouteErrorBoundary pathname={pathname}>{element}</RouteErrorBoundary>;
}

interface AppRouterProps {
  /** Request URL (path + query) — used for server rendering. */
  url?: string;
  /** CMS data the server fetched for `url`. */
  initialData?: InitialData | null;
}

/**
 * Rendered on the server (StaticRouter) and then hydrated in the browser
 * (BrowserRouter). Both render the same route tree, so the markup matches.
 */
export default function AppRouter({ url = '/', initialData = null }: AppRouterProps) {
  const app = (
    <InitialDataProvider value={initialData}>
      <AppRoutes />
    </InitialDataProvider>
  );

  return typeof window === 'undefined' ? (
    <StaticRouter location={url}>{app}</StaticRouter>
  ) : (
    <BrowserRouter>{app}</BrowserRouter>
  );
}
