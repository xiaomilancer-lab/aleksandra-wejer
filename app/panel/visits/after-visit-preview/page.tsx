import AfterVisitCard from "../../components/visits/AfterVisitCard";

export default function AfterVisitCardPreviewPage() {
  return (
    <AfterVisitCard
      visit={{
        id: 0,
        name: "Przykładowy Pacjent",
        visitDate: "2026-08-14",
        visitTime: "17:00",
        locationName: "Gabinet Aleksandry",
        locationAddress: "Przykładowy podgląd — bez danych prawdziwego pacjenta",
      }}
      nextVisit={{
        visitDate: "2026-08-28",
        visitTime: "17:00",
        locationName: "Gabinet Aleksandry",
      }}
    />
  );
}
