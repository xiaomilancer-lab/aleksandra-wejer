/**
 * Jedno źródło ścieżek statycznych assetów PsychOLKI.
 *
 * Wartości są wyłącznie stringami URL z katalogu `public`; nie importują
 * plików graficznych do bundla JavaScript.
 */
export const PsycholkaAssets = {
  greeting: "/psycholka/greeting/1_greeting_macha.png",
  booking: {
    search: "/psycholka/booking/2_search_lupa.png",
    calendar: "/psycholka/booking/3_booking_kalendarz.png",
  },
  emotions: {
    success: "/psycholka/emotions/5_success_konfetti.png",
    sick: "/psycholka/emotions/8_sick_chora.png",
    goodnight: "/psycholka/emotions/18_goodnight_do_jutra.png",
  },
  work: "/psycholka/work/16_work_pracuje.png",
  waiting: "/psycholka/waiting/9_waiting_czeka.png",
  children: "/psycholka/children/10_children_mis.png",
  couples: "/psycholka/couples/11_couples_para.png",
  lifestyle: {
    coffee: "/psycholka/lifestyle/4_coffee_kubek.png",
    vacation: "/psycholka/lifestyle/7_vacation_wakacje.png",
  },
  ideas: {
    idea: "/psycholka/ideas/15_idea_pomysl.png",
  },
  system: {
    sleep: "/psycholka/system/6_sleep_spi.png",
  },
  legacy: {
    greetingDefault: "/psycholka/greeting/greeting-default-v1.webp",
    openArmsDefault: "/psycholka/open-arms/open-arms-default-v1.webp",
    pointBookingDefault: "/psycholka/point-booking/point-booking-default-v1.webp",
    idleDefault: "/psycholka/idle/idle-default-v1.webp",
    waveDefault: "/psycholka/wave/wave-default-v1.webp",
    coffeeDefault: "/psycholka/coffee/coffee-default-v1.webp",
    searchDefault: "/psycholka/search/search-default-v1.webp",
    sadDefault: "/psycholka/sad/sad-default-v1.webp",
    happyDefault: "/psycholka/happy/happy-default-v1.webp",
    meetAleksandraDefault: "/psycholka/meet-aleksandra/meet-aleksandra-default-v1.webp",
    helpPathDefault: "/psycholka/help-path/help-path-default-v1.webp",
    locationsDefault: "/psycholka/locations/locations-default-v1.webp",
    reviewsDefault: "/psycholka/reviews/reviews-default-v1.webp",
    accountWhisperDefault: "/psycholka/account-whisper/account-whisper-default-v1.webp",
    bookingChoiceDefault: "/psycholka/booking-choice/booking-choice-default-v1.webp",
    goodbyeDefault: "/psycholka/goodbye/goodbye-default-v1.webp",
  },
} as const;
