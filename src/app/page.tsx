import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import HomeClient from './home-loader';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen smooth-scroll">
      <Navbar />
      <main className="flex-1 flex flex-col items-center smooth-scroll">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}
