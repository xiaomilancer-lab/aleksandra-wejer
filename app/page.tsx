import Quote from "./components/Quote";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LocalBusinessSchema from "./components/LocalBusinessSchema";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <LocalBusinessSchema />

      <Quote />

      <Hero />

      <About />

      <Services />

      <Contact />

    </main>
  );
}