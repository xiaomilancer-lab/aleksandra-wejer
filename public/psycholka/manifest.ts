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
} as const;
