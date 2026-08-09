import Quote from "./components/Quote";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Calendar from "./components/Calendar";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import PublicPsycholkaWelcome from "./components/PublicPsycholkaWelcome";
import PublicBookingAccess from "./components/PublicBookingAccess";
import PublicWelcomeReplay from "./components/PublicWelcomeReplay";
import PatientAccountTeaser from "./components/PatientAccountTeaser";
import PublicGuidedJourneyEnd from "./components/PublicGuidedJourneyEnd";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <LocalBusinessSchema />

      <PublicBookingAccess />
      <PublicPsycholkaWelcome />

     <Quote />

      <Hero />

      <About />

      <PatientAccountTeaser />

      <Services />

      <Calendar />
      
      <FAQ />


      <Contact />

      <PublicGuidedJourneyEnd />

      <div className="bg-[#F8F5F0] pb-6 text-center"><PublicWelcomeReplay /></div>

      <Footer />

    </main>
  );
}
