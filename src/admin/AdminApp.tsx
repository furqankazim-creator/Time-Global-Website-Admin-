import { Route, Switch } from "wouter";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ServicesListPage from "./pages/ServicesListPage";
import ServiceEditPage from "./pages/ServiceEditPage";
import MediaPage from "./pages/MediaPage";
import LeadsPage from "./pages/LeadsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import RedirectsPage from "./pages/RedirectsPage";
import AuditLogPage from "./pages/AuditLogPage";
import {
  ProjectsListPage, PostsListPage, TestimonialsListPage, TeamListPage, StoriesListPage,
} from "./pages/lists";
import {
  ProjectEditPage, PostEditPage, TestimonialEditPage, TeamEditPage, JobEditPage, StoryEditPage,
} from "./pages/edits";
import { JobsListPage, NotificationsPage } from "./pages/careers";
import { AdminLayout } from "./components/AdminLayout";

function NotBuilt({ title }: { title: string }) {
  return (
    <AdminLayout title={title}>
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="font-semibold mb-1">{title} isn't built yet</p>
        <p className="text-muted-foreground text-sm">
          Scheduled for a later phase. The nav entry is here so the structure is visible.
        </p>
      </div>
    </AdminLayout>
  );
}

/** Gate: no authenticated user → login. Never renders admin chrome to guests. */
function Guarded() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <Switch>
      <Route path="/admin" component={DashboardPage} />

      <Route path="/admin/services" component={ServicesListPage} />
      <Route path="/admin/services/new">{() => <ServiceEditPage />}</Route>
      <Route path="/admin/services/:id">{(p) => <ServiceEditPage id={p.id} />}</Route>

      <Route path="/admin/projects" component={ProjectsListPage} />
      <Route path="/admin/projects/new">{() => <ProjectEditPage />}</Route>
      <Route path="/admin/projects/:id">{(p) => <ProjectEditPage id={p.id} />}</Route>

      <Route path="/admin/stories" component={StoriesListPage} />
      <Route path="/admin/stories/new">{() => <StoryEditPage />}</Route>
      <Route path="/admin/stories/:id">{(p) => <StoryEditPage id={p.id} />}</Route>

      <Route path="/admin/case-studies" component={ProjectsListPage} />
      <Route path="/admin/case-studies/new">{() => <ProjectEditPage />}</Route>
      <Route path="/admin/case-studies/:id">{(p) => <ProjectEditPage id={p.id} />}</Route>

      <Route path="/admin/posts" component={PostsListPage} />
      <Route path="/admin/posts/new">{() => <PostEditPage />}</Route>
      <Route path="/admin/posts/:id">{(p) => <PostEditPage id={p.id} />}</Route>

      <Route path="/admin/testimonials" component={TestimonialsListPage} />
      <Route path="/admin/testimonials/new">{() => <TestimonialEditPage />}</Route>
      <Route path="/admin/testimonials/:id">{(p) => <TestimonialEditPage id={p.id} />}</Route>

      <Route path="/admin/team" component={TeamListPage} />
      <Route path="/admin/team/new">{() => <TeamEditPage />}</Route>
      <Route path="/admin/team/:id">{(p) => <TeamEditPage id={p.id} />}</Route>

      <Route path="/admin/media" component={MediaPage} />

      <Route path="/admin/jobs" component={JobsListPage} />
      <Route path="/admin/jobs/new">{() => <JobEditPage />}</Route>
      <Route path="/admin/jobs/:id">{(p) => <JobEditPage id={p.id} />}</Route>
      <Route path="/admin/leads" component={LeadsPage} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route path="/admin/settings/:tab" component={SettingsPage} />
      <Route path="/admin/notifications" component={NotificationsPage} />

      <Route path="/admin/users" component={UsersPage} />
      <Route path="/admin/redirects" component={RedirectsPage} />
      <Route path="/admin/audit-logs" component={AuditLogPage} />

      <Route>{() => <NotBuilt title="Page not found" />}</Route>
    </Switch>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Guarded />
    </AuthProvider>
  );
}
