export default function Quote() {
  return (
    <section className="bg-[#EDE8DF] border-b border-[#DDD5C8]">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center">

        <p className="uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62]">
          🌿 Chwila dla siebie
        </p>

        <blockquote className="mt-5 text-2xl md:text-3xl italic leading-relaxed text-[#4B4338]">
          „Nie musisz być silny przez cały czas.
          <br />
          Czasem największą odwagą jest pozwolić sobie na wsparcie.”
        </blockquote>

      </div>
    </section>
  );
}