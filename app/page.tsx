import Quote from "./components/Quote";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LocalBusinessSchema from "./components/LocalBusinessSchema";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <LocalBusinessSchema />

      <Quote />

      <Hero />

      <Services />

      <Contact />

    </main>
  );
}
