import BookingWizard from "./booking/BookingWizard";
import BookingChoice from "./BookingChoice";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

export default function Calendar() {
  return (
    <section
      id="kalendarz"
      className="bg-[#F8F5F0] py-28"
    >

      <div className="max-w-7xl mx-auto px-8">
        <PublicPsycholkaGuide action="locations" message="Zobacz, gdzie możesz spotkać Aleksandrę." />

        <div className="text-center">

          <span className="uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62]">
            UMÓW KONSULTACJĘ
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-[#4B4338]">
            Wybierz dogodny termin
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-xl leading-8 text-gray-600">
            Sprawdź dostępne terminy konsultacji
            i wybierz dzień, który najbardziej Ci odpowiada.
          </p>

        </div>

        <div className="mx-auto mt-8 flex justify-center">
          <BookingChoice />
        </div>

        <BookingWizard />

      </div>

    </section>
  );
}
