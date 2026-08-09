import BookingWizard from "./booking/BookingWizard";
import BookingChoice from "./BookingChoice";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

export default function Calendar() {
  return (
    <section id="kalendarz" className="bg-[#F8F5F0] py-16 pb-28 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="hidden md:block"><PublicPsycholkaGuide action="locations" message="Zobacz, gdzie możesz spotkać Aleksandrę." /></div>
        <div className="text-center">
          <span className="hidden uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62] md:inline">UMÓW KONSULTACJĘ</span>
          <h2 className="mt-2 text-3xl font-bold text-[#4B4338] md:mt-5 md:text-4xl lg:text-5xl">Wybierz dogodny termin</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:mt-6 md:text-xl md:leading-8">Sprawdź dostępne terminy konsultacji i wybierz dzień, który najbardziej Ci odpowiada.</p>
        </div>
        <div className="mx-auto mt-8 flex justify-center"><BookingChoice /></div>
        <BookingWizard />
      </div>
    </section>
  );
}
