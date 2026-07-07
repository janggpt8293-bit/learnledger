import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import WritingPage from '@/components/pages/WritingPage';
import ArticleDetailPage from '@/components/pages/ArticleDetailPage';
import AboutPage from '@/components/pages/AboutPage';
import ArticlePage from '@/components/pages/ArticlePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectDetailPage from '@/components/pages/ProjectDetailPage';
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "writing",
        element: <WritingPage />,
        routeMetadata: {
          pageIdentifier: 'writing',
        },
      },
      {
        path: "writing/:slug",
        element: <ArticleDetailPage />,
        routeMetadata: {
          pageIdentifier: 'article-detail',
        },
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
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        routeMetadata: {
          pageIdentifier: 'projects',
        },
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
        routeMetadata: {
          pageIdentifier: 'project-detail',
        },
      },
      {
        path: aiEnglishWeaknessArticle.path.slice(1),
        element: <ArticlePage />,
        routeMetadata: {
          pageIdentifier: 'article',
        },
      },
      {
        // old URL for the same article — redirect to the canonical one
        path: "article/ai-exposed-biggest-english-weakness",
        element: <Navigate to={aiEnglishWeaknessArticle.path} replace />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
