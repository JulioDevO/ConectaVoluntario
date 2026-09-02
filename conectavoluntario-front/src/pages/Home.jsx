import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WorksSection from '../components/WorksSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    // Trocamos o bg-slate-50 pelo bg-gradient...
    <div className="min-h-screen bg-gradient-to-b from-slate-200 via-blue-100 to-emerald-100 text-slate-900 font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}