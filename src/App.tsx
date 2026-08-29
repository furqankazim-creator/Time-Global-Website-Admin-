import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactModalProvider } from "@/hooks/use-contact-modal";
import { ThemeProvider } from "@/hooks/use-theme";
import { Preloader } from "@/components/Preloader";
import HomePage from "@/pages/HomePage";
import WorkPage from "@/pages/WorkPage";
import ServicesPage from "@/pages/ServicesPage";
import StoriesPage from "@/pages/StoriesPage";
import CareersPage from "@/pages/CareersPage";
import AwardsPage from "@/pages/AwardsPage";
import AboutPage from "@/pages/AboutPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ProjectPage from "@/pages/ProjectPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import CookiePolicy from "@/pages/CookiePolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import NotFoundPage from "@/pages/NotFoundPage";
import ContactModal from "@/components/ContactModal";

// Lazy: keeps the admin bundle out of the public site's initial load.
const AdminApp = lazy(() => import("@/admin/AdminApp"));

/**
 * Every admin write confirms itself. Handled centrally on the mutation cache
 * rather than per-page, so a save added later is covered without anyone
 * remembering to wire up a toast.
 *
 * Opt out or relabel per mutation:
 *   meta: { silent: true }              — no toast (background writes)
 *   meta: { success: "Service saved" }  — custom confirmation
 */
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: { silent?: boolean; success?: string };
  }
}

const mutationCache = new MutationCache({
  onSuccess: (_data, _vars, _ctx, mutation) => {
    // Gated on the admin surface: the public site has no mutations today, and
    // a future contact form shouldn't inherit admin-flavoured confirmations.
    if (!location.pathname.startsWith("/admin")) return;
    if (mutation.meta?.silent) return;
    toast({ title: mutation.meta?.success ?? "Saved" });
  },
  onError: (error, _vars, _ctx, mutation) => {
    if (!location.pathname.startsWith("/admin")) return;
    if (mutation.meta?.silent) return;
    toast({
      variant: "destructive",
      title: "Couldn't save",
      description: error instanceof Error ? error.message : "Something went wrong.",
    });
  },
});

const queryClient = new QueryClient({ mutationCache });

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/work" component={WorkPage} />
      <Route path="/work/:slug">{(p) => <ProjectPage slug={p.slug} />}</Route>
      <Route path="/services" component={ServicesPage} />
      <Route path="/stories" component={StoriesPage} />
      <Route path="/story" component={StoriesPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/awards" component={AwardsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug">{(p) => <BlogPostPage slug={p.slug} />}</Route>
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/privacy_and_policy" component={PrivacyPolicy} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

const AdminFallback = () => (
  <div className="min-h-[100dvh] grid place-items-center bg-background text-muted-foreground text-sm">
    Loading admin…
  </div>
);

function App() {
  // The admin is a separate surface: no preloader, marketing modal, or site
  // chrome. Branch here rather than inside Router so none of it mounts.
  const isAdmin = useLocation()[0].startsWith("/admin");

  if (isAdmin) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={<AdminFallback />}>
              <AdminApp />
            </Suspense>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ContactModalProvider>
            <Preloader />
            <Router />
            <ContactModal />
            <Toaster />
          </ContactModalProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
