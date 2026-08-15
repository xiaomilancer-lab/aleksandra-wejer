import type { Metadata } from "next";
import LegalDocumentLayout, { LegalList, LegalSection } from "@/app/components/LegalDocumentLayout";
import { PRACTICE_CONTACT, TERMS_VERSION } from "@/app/lib/legal";

export const metadata: Metadata = { title: "Regulamin konta | Aleksandra Wejer", description: "Zasady korzystania z prywatnego pokoju PsychOLKI." };

export default function AccountTermsPage() {
  return (
    <LegalDocumentLayout eyebrow="Prywatny pokój PsychOLKI" title="Regulamin konta" version={TERMS_VERSION}>
      <LegalSection title="1. Kto świadczy usługę">
        <p>Usługę konta w serwisie aleksandrawejer.pl świadczy {PRACTICE_CONTACT.name}, psycholog. Kontakt: <a className="font-semibold underline" href={`mailto:${PRACTICE_CONTACT.email}`}>{PRACTICE_CONTACT.email}</a>, tel. <a className="font-semibold underline" href="tel:+48510777469">{PRACTICE_CONTACT.phone}</a>.</p>
        <p>Regulamin jest udostępniany bezpłatnie przed założeniem konta w formie umożliwiającej jego zapisanie i odtworzenie.</p>
      </LegalSection>
      <LegalSection title="2. Zakres bezpłatnej usługi konta">
        <LegalList>
          <li>utworzenie prywatnego pokoju pacjenta albo rodzica/opiekuna;</li>
          <li>organizacyjne informacje o terminach oraz możliwość wysłania prośby o zmianę wizyty;</li>
          <li>odbieranie wiadomości, materiałów, ogłoszeń i dobrowolnych zaproszeń od gabinetu;</li>
          <li>korzystanie z Babyroomu, informacji o dojeździe i innych funkcji udostępnianych w pokoju.</li>
        </LegalList>
        <p>Założenie konta nie jest równoznaczne z zawarciem umowy na konsultację. Rezerwacja i realizacja wizyty podlegają odrębnym ustaleniom z gabinetem.</p>
      </LegalSection>
      <LegalSection title="3. Ważne granice serwisu">
        <p>Konto ma charakter organizacyjny i informacyjny. Nie jest dokumentacją psychologiczną ani medyczną, narzędziem do diagnozy, świadczeniem pomocy kryzysowej ani kanałem alarmowym. W sytuacji bezpośredniego zagrożenia życia lub zdrowia należy skontaktować się z numerem 112 albo właściwą placówką pomocy.</p>
        <p>W pokoju użytkownika nie są udostępniane notatki psychologa z sesji. Prosimy nie wpisywać do formularzy i zwykłych wiadomości szczegółowych opisów zdrowia, diagnoz, terapii ani innych danych szczególnie chronionych. Sprawy wymagające poufnej rozmowy należy omówić bezpośrednio z Aleksandrą.</p>
      </LegalSection>
      <LegalSection title="4. Kto może utworzyć konto">
        <p>Konto może utworzyć osoba pełnoletnia dla siebie albo rodzic/opiekun prawny w celu korzystania z funkcji dotyczących dziecka. Samodzielna rejestracja osoby małoletniej nie jest przewidziana. Rola psychologa jest nadawana wyłącznie ręcznie przez administratora.</p>
        <p>Użytkownik podaje dane prawdziwe, aktualne i niepodszywa się pod inną osobę. Połączenie konta z kartą pacjenta następuje dopiero po weryfikacji przez gabinet.</p>
      </LegalSection>
      <LegalSection title="5. Wymagania techniczne i bezpieczeństwo">
        <p>Do korzystania potrzebne są aktualna przeglądarka internetowa, dostęp do internetu, aktywny adres e-mail oraz obsługa plików cookie niezbędnych do zalogowania. Użytkownik chroni hasło, nie udostępnia konta innym osobom i zgłasza podejrzenie przejęcia konta.</p>
        <p>Zabronione jest dostarczanie treści bezprawnych, naruszających prawa innych osób, podejmowanie prób uzyskania dostępu do cudzych danych, obchodzenie zabezpieczeń oraz zakłócanie działania serwisu.</p>
      </LegalSection>
      <LegalSection title="6. Zawarcie i zakończenie umowy o konto">
        <p>Umowa o bezpłatne prowadzenie konta zostaje zawarta po poprawnym przesłaniu formularza, zaakceptowaniu regulaminu i potwierdzeniu adresu e-mail. Jest zawierana na czas nieoznaczony.</p>
        <p>Użytkownik może w dowolnym czasie zażądać usunięcia konta, pisząc na {PRACTICE_CONTACT.email}. Usunięcie konta nie usuwa automatycznie dokumentacji, którą gabinet ma obowiązek przechowywać poza pokojem użytkownika na podstawie odrębnych przepisów lub uzasadnionych obowiązków zawodowych.</p>
        <p>Dostęp może zostać czasowo ograniczony w razie zagrożenia bezpieczeństwa, naruszenia regulaminu albo prac technicznych. Przed trwałym zakończeniem usługi, o ile sytuacja na to pozwala, użytkownik otrzyma informację i możliwość wyjaśnienia.</p>
      </LegalSection>
      <LegalSection title="7. Reklamacje i kontakt">
        <p>Zgłoszenie dotyczące działania konta można wysłać na {PRACTICE_CONTACT.email}. Powinno zawierać adres konta, opis problemu i oczekiwany sposób rozwiązania. Odpowiedź zostanie udzielona bez zbędnej zwłoki, nie później niż w ciągu 14 dni.</p>
      </LegalSection>
      <LegalSection title="8. Zmiany regulaminu">
        <p>O istotnej zmianie regulaminu zarejestrowani użytkownicy zostaną poinformowani przed jej wejściem w życie. Nowa wersja będzie oznaczona numerem i datą. Zmiana nie ogranicza praw nabytych ani praw konsumenta wynikających z bezwzględnie obowiązujących przepisów.</p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
