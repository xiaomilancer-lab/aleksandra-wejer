import HelpAccordion from "./HelpAccordion";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

export default function Services() {
  return (
    <section id="oferta" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PublicPsycholkaGuide action="help_path" message="Zobacz, w czym Aleksandra może Ci pomóc." />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6D7A62]">W czym mogę pomóc?</p>
          <h2 className="mt-4 text-4xl font-bold text-[#4B4338] lg:text-5xl">Wsparcie dopasowane do Twojej sytuacji</h2>
          <p className="mt-5 text-lg leading-8 text-gray-600">Wybierz obszar, aby spokojnie sprawdzić, jak może wyglądać pierwsza rozmowa.</p>
        </div>
        <HelpAccordion />
      </div>
    </section>
  );
}
