import { connection } from "next/server";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./components/Dashboard";
import DashboardAttention from "./components/DashboardAttention";
import DashboardFollowupReminders from "./components/DashboardFollowupReminders";
import DashboardImportantDates from "./components/DashboardImportantDates";
import DashboardNewRequests from "./components/DashboardNewRequests";
import DashboardNextVisit from "./components/DashboardNextVisit";
import DashboardQuickActions from "./components/DashboardQuickActions";
import DashboardSitePulse from "./components/DashboardSitePulse";
import DashboardWeekSchedule from "./components/DashboardWeekSchedule";
import PsycholkaGentleCelebration from "./components/PsycholkaGentleCelebration";
import PsycholkaOnboarding from "./components/PsycholkaOnboarding";
import TodayQueue from "./components/TodayQueue";
import WelcomeHeader from "./components/WelcomeHeader";
import type { FollowupReminderAssignment, ImportantDateOccurrence } from "./domain";
import { getDashboardAttentionItems, getDashboardDayData, getDashboardWeekData, getNewBookingRequests, getNextUpcomingVisit, getTodayQueue, getWarsawDateParts, type DashboardAttentionItem, type DashboardDayData, type DashboardRequest, type DashboardWeekData, type TodayQueueItem } from "./services/dashboardService";
import { getOpenFollowupRemindersForNearestVisits } from "./services/followupReminderService";
import { getImportantDateOccurrences, getImportantDates } from "./services/importantDateService";
import { getSitePulseDashboardData } from "./services/sitePulseService";
import { emptySitePulseDashboardData, type SitePulseDashboardData } from "@/app/site-pulse/domain";

export default async function PanelPage() {
  await connection();
  const now = new Date();
  let dashboardData: DashboardDayData = { todayVisits: [], nextVisit: null, attentionVisits: [], newPatientsToday: null };
  let weekData: DashboardWeekData = { days: [], totalVisits: 0, isAvailable: false };
  let todayQueue: TodayQueueItem[] = [];
  let nextVisit: TodayQueueItem | null = null;
  let newRequests: DashboardRequest[] = [];
  let attentionItems: DashboardAttentionItem[] = [];
  let followupReminders: FollowupReminderAssignment[] = [];
  let importantDateOccurrences: ImportantDateOccurrence[] = [];
  let sitePulseData: SitePulseDashboardData = emptySitePulseDashboardData;
  let loadError = false;
  const sitePulsePromise = getSitePulseDashboardData(now).catch(() => emptySitePulseDashboardData);

  try {
    const [importantDates, dashboard, week, queue, upcoming, requests, attention, followups] = await Promise.all([
      getImportantDates(),
      getDashboardDayData(now),
      getDashboardWeekData(now),
      getTodayQueue(now),
      getNextUpcomingVisit(now),
      getNewBookingRequests(now),
      getDashboardAttentionItems(now),
      getOpenFollowupRemindersForNearestVisits(getWarsawDateParts(now).date),
    ]);
    importantDateOccurrences = getImportantDateOccurrences(importantDates, getWarsawDateParts(now).date);
    dashboardData = dashboard;
    weekData = week;
    todayQueue = queue;
    nextVisit = upcoming;
    newRequests = requests;
    attentionItems = attention;
    followupReminders = followups;
  } catch {
    loadError = true;
  }
  sitePulseData = await sitePulsePromise;

  const celebrationDate = getWarsawDateParts(now).date;

  return (
    <AuthGuard>
      <Dashboard>
        <PsycholkaOnboarding />
          <PsycholkaGentleCelebration eventKey={`first-new-patient-${celebrationDate}`} enabled={(dashboardData.newPatientsToday ?? 0) > 0} />
        <div className="mx-auto max-w-7xl">
          <WelcomeHeader initialNow={now.toISOString()} celebrate={(dashboardData.newPatientsToday ?? 0) > 0} hasVisits={todayQueue.length > 0} />
          {loadError && <p className="mt-6 rounded-2xl border border-[#E5E1D8] bg-[#FFF9EE] px-5 py-4 text-sm text-[#7A6540]">Kalendarz chwilowo nie jest dostępny. Spróbuj odświeżyć stronę za moment.</p>}
          <div className="mt-6 grid gap-6 xl:grid-cols-2"><DashboardNextVisit visit={nextVisit} /><DashboardNewRequests requests={newRequests} /></div>
          <div className="mt-6"><TodayQueue visits={todayQueue} initialNow={now.toISOString()} /></div>
          <div className="mt-6"><DashboardAttention items={attentionItems} /></div>
          <DashboardSitePulse initialData={sitePulseData} />
          <div className="mt-6 grid gap-6 xl:grid-cols-3"><DashboardWeekSchedule schedule={weekData} /><DashboardImportantDates occurrences={importantDateOccurrences} /><DashboardFollowupReminders assignments={followupReminders} /></div>
          <div className="mt-6"><DashboardQuickActions /></div>
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
