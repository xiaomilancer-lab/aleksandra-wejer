import BookingWizard from "./booking/BookingWizard";
import BookingChoice from "./BookingChoice";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

export default function Calendar() {
  return (
    <section id="kalendarz" className="scroll-mt-4 bg-[#F8F5F0] pb-28 pt-4 md:scroll-mt-0 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="hidden md:block"><PublicPsycholkaGuide action="locations" message="Zobacz, gdzie możesz spotkać Aleksandrę." /></div>
        <div className="hidden text-center md:block">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-[#6D7A62]">UMÓW KONSULTACJĘ</span>
          <h2 className="mt-2 text-3xl font-bold text-[#4B4338] md:mt-5 md:text-4xl lg:text-5xl">Wybierz dogodny termin</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:mt-6 md:text-xl md:leading-8">Sprawdź dostępne terminy konsultacji i wybierz dzień, który najbardziej Ci odpowiada.</p>
        </div>
        <div className="flex flex-col">
          <div className="order-2 mx-auto mt-8 flex w-full justify-center md:order-1"><BookingChoice /></div>
          <div className="order-1 md:order-2"><BookingWizard /></div>
        </div>
      </div>
    </section>
  );
}
