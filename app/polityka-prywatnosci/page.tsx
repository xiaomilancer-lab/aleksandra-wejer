import type { Metadata } from "next";
import LegalDocumentLayout, { LegalList, LegalSection } from "@/app/components/LegalDocumentLayout";
import { PRACTICE_CONTACT, PRIVACY_NOTICE_VERSION } from "@/app/lib/legal";

export const metadata: Metadata = { title: "Polityka prywatności | Aleksandra Wejer", description: "Informacje o ochronie danych użytkowników serwisu aleksandrawejer.pl." };

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout eyebrow="Ochrona danych" title="Polityka prywatności" version={PRIVACY_NOTICE_VERSION}>
      <LegalSection title="1. Administrator danych">
        <p>Administratorem danych przetwarzanych w związku z serwisem i kontem jest {PRACTICE_CONTACT.name}. Kontakt w sprawach prywatności: <a className="font-semibold underline" href={`mailto:${PRACTICE_CONTACT.email}`}>{PRACTICE_CONTACT.email}</a>, tel. <a className="font-semibold underline" href="tel:+48510777469">{PRACTICE_CONTACT.phone}</a>.</p>
      </LegalSection>
      <LegalSection title="2. Jakie dane przetwarzamy">
        <LegalList>
          <li>dane konta: imię i nazwisko, adres e-mail, wybrana rola oraz techniczne dane uwierzytelnienia;</li>
          <li>dane organizacyjne niezbędne do powiązania konta z właściwą osobą i wizytą;</li>
          <li>prośby o zmianę terminu, potwierdzenia odbioru wiadomości i ustawienia pokoju;</li>
          <li>dane techniczne i bezpieczeństwa, takie jak czas zdarzenia, identyfikator sesji, adres IP i informacje o przeglądarce, jeśli są rejestrowane przez infrastrukturę serwisu.</li>
        </LegalList>
        <p>Konto nie służy do przechowywania notatek z sesji ani pełnej dokumentacji psychologicznej. Nie wpisuj do zwykłych formularzy lub wiadomości diagnoz, szczegółów stanu zdrowia ani przebiegu terapii.</p>
      </LegalSection>
      <LegalSection title="3. Cele i podstawy prawne">
        <LegalList>
          <li>utworzenie i obsługa konta oraz realizacja wybranych funkcji — niezbędność do wykonania umowy lub działań przed jej zawarciem (art. 6 ust. 1 lit. b RODO);</li>
          <li>rozliczalność, obowiązki prawne i obsługa żądań dotyczących danych — obowiązek prawny (art. 6 ust. 1 lit. c RODO);</li>
          <li>ochrona kont, zapobieganie nadużyciom, ustalanie lub obrona roszczeń i rozwój bezpieczeństwa — prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO);</li>
          <li>opcjonalne wiadomości promocyjne — wyłącznie po odrębnej, dobrowolnej zgodzie, jeśli taka funkcja zostanie uruchomiona.</li>
        </LegalList>
        <p>Akceptacja regulaminu jest warunkiem zawarcia umowy o konto. Checkbox „zapoznałem się z polityką prywatności” potwierdza otrzymanie informacji — nie zastępuje podstawy prawnej przetwarzania.</p>
      </LegalSection>
      <LegalSection title="4. Odbiorcy i infrastruktura">
        <p>Dane mogą być powierzane podmiotom zapewniającym hosting, bazę danych i uwierzytelnianie, wysyłkę e-maili, bezpieczeństwo oraz obsługę techniczną — wyłącznie w zakresie potrzebnym do wykonania ich zadań. Obecnie serwis korzysta m.in. z infrastruktury Vercel, Supabase i Resend.</p>
        <p>Po samodzielnym kliknięciu zewnętrznego linku (np. Google Maps, opinie Google lub Bolt) użytkownik przechodzi do odrębnego usługodawcy, który przetwarza dane na własnych zasadach.</p>
        <p>Jeżeli usługodawca przetwarza dane poza Europejskim Obszarem Gospodarczym, przekazanie odbywa się z zastosowaniem mechanizmu przewidzianego w rozdziale V RODO, np. decyzji stwierdzającej odpowiedni stopień ochrony albo standardowych klauzul umownych.</p>
      </LegalSection>
      <LegalSection title="5. Jak długo przechowujemy dane">
        <p>Dane konta są przechowywane przez czas jego działania. Po zamknięciu konta dane są usuwane lub anonimizowane, chyba że ich dalsze ograniczone przechowywanie jest konieczne ze względu na obowiązek prawny, bezpieczeństwo albo ustalenie, dochodzenie lub obronę roszczeń — przez okres wynikający z właściwych terminów przedawnienia.</p>
        <p>Dane techniczne są przechowywane tylko przez okres potrzebny do bezpieczeństwa, diagnozy błędów i działania infrastruktury, zgodnie z konfiguracją usługodawców i zasadą minimalizacji.</p>
      </LegalSection>
      <LegalSection title="6. Prawa osoby">
        <p>W granicach przewidzianych przez RODO masz prawo do dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie oraz cofnięcia zgody na przyszłość, jeśli przetwarzanie opierało się na zgodzie.</p>
        <p>Żądanie można wysłać na {PRACTICE_CONTACT.email}. Masz również prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.</p>
      </LegalSection>
      <LegalSection title="7. Dobrowolność i konsekwencje niepodania danych">
        <p>Założenie konta jest dobrowolne. Imię, adres e-mail, rola, hasło oraz wymagane oświadczenia są potrzebne do utworzenia i zabezpieczenia konta; bez nich nie można świadczyć tej usługi. Konto nie jest warunkiem umówienia konsultacji innymi dostępnymi kanałami.</p>
      </LegalSection>
      <LegalSection title="8. Dzieci, profilowanie i pliki cookie">
        <p>Konto tworzy osoba pełnoletnia albo rodzic/opiekun prawny. Serwis nie przewiduje samodzielnej rejestracji dziecka. Nie podejmujemy wobec użytkowników decyzji wywołujących skutki prawne wyłącznie w sposób zautomatyzowany.</p>
        <p>Serwis wykorzystuje pliki cookie i podobne mechanizmy niezbędne do logowania, ochrony sesji i zachowania bezpieczeństwa. Ewentualne narzędzia opcjonalne będą uruchamiane zgodnie z właściwą podstawą i ustawieniami zgód.</p>
      </LegalSection>
      <LegalSection title="9. Zmiany i bezpieczeństwo">
        <p>Stosujemy środki adekwatne do ryzyka, w tym kontrolę ról, ograniczenie dostępu, szyfrowane połączenia i dodatkową blokadę kart pacjentów. Żaden system nie daje jednak absolutnej gwarancji bezpieczeństwa; podejrzenie naruszenia należy niezwłocznie zgłosić administratorowi.</p>
        <p>Istotne zmiany polityki będą oznaczane nowym numerem wersji i datą. Jeżeli zmiana wpływa na sposób korzystania z konta, użytkownik otrzyma odpowiednią informację.</p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
