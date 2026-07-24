export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    "@id": "https://aleksandrawejer.pl/#psychologist",

    name: "Aleksandra Wejer – Psycholog",

    description:
      "Gabinet psychologiczny Aleksandry Wejer oferujący konsultacje psychologiczne dla osób dorosłych, dzieci, młodzieży, par i rodzin w Nowej Wsi Rzecznej koło Starogardu Gdańskiego.",

    url: "https://aleksandrawejer.pl",

    telephone: "+48510777469",

    email: "psycholog@aleksandrawejer.pl",

    image: "https://aleksandrawejer.pl/images/aleksandra.jpeg",

    logo: "https://aleksandrawejer.pl/images/logo.png",

    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Kasztanowa 1",
      addressLocality: "Nowa Wieś Rzeczna",
      postalCode: "83-200",
      addressCountry: "PL"
    },

    areaServed: [
      {
        "@type": "City",
        name: "Starogard Gdański"
      },
      {
        "@type": "City",
        name: "Nowa Wieś Rzeczna"
      },
      {
        "@type": "City",
        name: "Skarszewy"
      },
      {
        "@type": "City",
        name: "Pelplin"
      },
      {
        "@type": "City",
        name: "Tczew"
      },
      {
        "@type": "City",
        name: "Zblewo"
      },
      {
        "@type": "City",
        name: "Bobowo"
      }
    ],

    knowsAbout: [
      "Psychologia",
      "Konsultacje psychologiczne",
      "Wsparcie psychologiczne",
      "Psychologia dzieci",
      "Psychologia młodzieży",
      "Psychologia osób dorosłych",
      "Wsparcie par",
      "Wsparcie rodzin",
      "Stres",
      "Kryzysy życiowe",
      "Trudności emocjonalne",
      "Relacje"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}