import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/Header';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            {children}
        </main>
         <footer className="py-4 text-center text-sm text-muted-foreground">
            <p>Built with ❤️ by Firebase Studio.</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
