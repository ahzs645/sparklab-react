import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import PhotoStrip from '../components/sections/PhotoStrip';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <PhotoStrip />
      <Contact />
    </>
  );
}
