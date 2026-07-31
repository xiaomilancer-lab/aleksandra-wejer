"use client";

import Script from "next/script";

export default function ZnanyLekarzWidget() {
  return (
    <div
  id="znanylekarz-widget"
  className="mt-10 rounded-3xl border border-[#EFE8DD] bg-white p-8 shadow-xl"
>
      <h2 className="text-2xl font-bold text-[#4B4338]">
        Umów wizytę przez ZnanyLekarz
      </h2>

      <p className="mt-2 text-gray-600">
        Wizyty w Arthro Cure Clinic są rejestrowane przez system
        ZnanyLekarz.
      </p>

      <div className="mt-8">
        <a
          id="zl-url"
          className="zl-url"
          href="https://www.znanylekarz.pl/aleksandra-wejer/psycholog/starogard-gdanski"
          rel="nofollow"
          data-zlw-doctor="aleksandra-wejer"
          data-zlw-type="big"
          data-zlw-opinion="false"
          data-zlw-hide-branding="true"
          data-zlw-saas-only="true"
          data-zlw-a11y-title="Widget umówienia wizyty lekarskiej"
        >
          Umów wizytę
        </a>
      </div>

      <Script
        id="znanylekarz-widget"
        strategy="afterInteractive"
        src="https://platform.docplanner.com/js/widget.js"
      />
    </div>
  );
}