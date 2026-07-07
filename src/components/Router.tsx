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
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
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
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
