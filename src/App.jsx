import { useTheme } from './hooks/useTheme';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import PhotoStrip from './components/sections/PhotoStrip';
// import VisitInfo from './components/sections/VisitInfo';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Services />
        <PhotoStrip />
        {/* <VisitInfo /> */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
