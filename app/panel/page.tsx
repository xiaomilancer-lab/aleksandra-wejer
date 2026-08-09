import { connection } from "next/server";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./components/Dashboard";
import DashboardDailyInspiration from "./components/DashboardDailyInspiration";
import DashboardFollowUp from "./components/DashboardFollowUp";
import DashboardFollowupReminders from "./components/DashboardFollowupReminders";
import DashboardQuickActions from "./components/DashboardQuickActions";
import DashboardUpcomingVisits from "./components/DashboardUpcomingVisits";
import DashboardWeekSchedule from "./components/DashboardWeekSchedule";
import NextBestAction from "./components/NextBestAction";
import PsycholkaGentleCelebration from "./components/PsycholkaGentleCelebration";
import PsycholkaOnboarding from "./components/PsycholkaOnboarding";
import TodayQueue from "./components/TodayQueue";
import WelcomeHeader from "./components/WelcomeHeader";
import type { FollowupReminderAssignment, FollowupSuggestion } from "./domain";
import { getDailyFlowState, getDashboardDayData, getDashboardWeekData, getTodayQueue, getWarsawDateParts, type DailyFlowState, type DashboardDayData, type DashboardWeekData, type TodayQueueItem } from "./services/dashboardService";
import { getOpenFollowupRemindersForNearestVisits } from "./services/followupReminderService";
import { getFollowupSuggestions } from "./services/followupService";

export default async function PanelPage() {
  await connection();
  const now = new Date();
  let dashboardData: DashboardDayData = { todayVisits: [], nextVisit: null, attentionVisits: [], newPatientsToday: null };
  let weekData: DashboardWeekData = { days: [], totalVisits: 0, isAvailable: false };
  let todayQueue: TodayQueueItem[] = [];
  let followupSuggestions: FollowupSuggestion[] = [];
  let followupReminders: FollowupReminderAssignment[] = [];
  let dailyFlow: DailyFlowState = { kind: "today_queue", title: "Zobacz dzisiejszą kolejkę", description: "Nie ma teraz pilnych działań.", href: "/panel", visitTime: null };
  let loadError = false;

  try {
    [dashboardData, weekData, todayQueue, followupSuggestions, followupReminders, dailyFlow] = await Promise.all([
      getDashboardDayData(now),
      getDashboardWeekData(now),
      getTodayQueue(now),
      getFollowupSuggestions(now),
      getOpenFollowupRemindersForNearestVisits(getWarsawDateParts(now).date),
      getDailyFlowState(now),
    ]);
  } catch {
    loadError = true;
  }

  const celebrationDate = getWarsawDateParts(now).date;

  return (
    <AuthGuard>
      <Dashboard>
        <PsycholkaOnboarding />
        <PsycholkaGentleCelebration eventKey={`first-new-patient-${celebrationDate}`} enabled={(dashboardData.newPatientsToday ?? 0) > 0} />
        <div className="mx-auto max-w-7xl">
          <WelcomeHeader initialNow={now.toISOString()} celebrate={(dashboardData.newPatientsToday ?? 0) > 0} hasVisits={todayQueue.length > 0} />
          <NextBestAction state={dailyFlow} />
          {loadError && <p className="mt-6 rounded-2xl border border-[#E5E1D8] bg-[#FFF9EE] px-5 py-4 text-sm text-[#7A6540]">Kalendarz chwilowo nie jest dostępny. Spróbuj odświeżyć stronę za moment.</p>}
          <div className="mt-6"><TodayQueue visits={todayQueue} initialNow={now.toISOString()} /></div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><DashboardDailyInspiration /><DashboardQuickActions /></div>
          <div className="mt-6 grid gap-6 xl:grid-cols-3"><DashboardWeekSchedule schedule={weekData} /><DashboardUpcomingVisits visits={dashboardData.attentionVisits} /><DashboardFollowUp suggestions={followupSuggestions} /><DashboardFollowupReminders assignments={followupReminders} /></div>
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
