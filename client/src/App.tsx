import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import AppLayout from "@/components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={HomePage} />
      <Route path="/candidates" component={CandidatesPage} />
      <Route path="/upload" component={UploadPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Route components wrapped with the AppLayout
function HomePage() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

function CandidatesPage() {
  return (
    <AppLayout>
      <Home /> {/* Using Home component for now, but could create a separate CandidatesPage */}
    </AppLayout>
  );
}

function UploadPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Upload Resumes</h1>
        <p className="text-muted-foreground">
          Upload resumes in bulk to analyze and categorize candidates automatically.
        </p>
      </div>
    </AppLayout>
  );
}

function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics and insights about your candidate pool.
        </p>
      </div>
    </AppLayout>
  );
}

function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and preferences.
        </p>
      </div>
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
