import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-6 py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
