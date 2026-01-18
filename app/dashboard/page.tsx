import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/common/AnimatedBackground';

export default function DashboardPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          <div className="glass-effect p-8 rounded-2xl">
            <p className="text-gray-300">Dashboard content coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

