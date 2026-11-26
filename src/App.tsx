import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { PageChromeProvider } from "@/contexts";
import { AppRoutes } from "@/app/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen bg-neutral-50">
        <PageChromeProvider>
          <AppRoutes />
        </PageChromeProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
