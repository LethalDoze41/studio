import Header from '@/components/Header';
import RecipeGenerator from '@/components/RecipeGenerator';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <RecipeGenerator />
        </main>
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ by Firebase Studio.</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}