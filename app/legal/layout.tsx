import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import Footer from '@/components/layout/Footer';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <ModernPublicHeader />
      <main className="max-w-4xl mx-auto px-6 py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
