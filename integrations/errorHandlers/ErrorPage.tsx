import { useEffect, useRef } from "react";

// Receives the error from the router's error boundary (src/components/Router.tsx);
// useRouteError() only works with a data router, which can't be server-rendered here.
export default function ErrorPage({ error }: { error: Error }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ErrorOverlay = window.customElements.get('vite-error-overlay');
      ref.current.appendChild(new ErrorOverlay(error, 'runtime'));
    }
  }, [error]);

  return (
    <div ref={ref}></div>
  );
};
