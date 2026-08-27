import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getWarsawDateParts } from "./dashboardService";

type StatisticsRow = {
  visit_date: string;
  status: string;
  location_id: string | null;
  location: string | null;
  visit_fee: number | string | null;
};

export type PracticePeriodStatistics = {
  key: string;
  label: string;
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  otherVisits: number;
  completionRate: number;
  cancellationRate: number;
  completedRevenue: number;
  scheduledValue: number;
  completedWithoutFee: number;
  feeCoverageRate: number;
  locations: {
    zielinscy: number;
    arthro: number;
    other: number;
    zielinscyShare: number;
    arthroShare: number;
    otherShare: number;
  };
};

export type PracticeYearStatistics = PracticePeriodStatistics & {
  year: number;
  months: PracticePeriodStatistics[];
};

export type PracticeStatisticsData = {
  currentYear: number;
  currentMonth: number;
  financeAvailable: boolean;
  years: PracticeYearStatistics[];
  allTime: PracticePeriodStatistics;
};

const fieldsWithFee = "visit_date, status, location_id, location, visit_fee";
const fieldsWithoutFee = "visit_date, status, location_id, location";

export async function getPracticeStatisticsData(now: Date = new Date()): Promise<PracticeStatisticsData> {
  const currentDate = getWarsawDateParts(now).date;
  const currentYear = Number(currentDate.slice(0, 4));
  const currentMonth = Number(currentDate.slice(5, 7));
  const withFinance = await loadRows(fieldsWithFee);
  const financeAvailable = withFinance.errorCode !== "42703";
  const rows = financeAvailable ? withFinance.rows : (await loadRows(fieldsWithoutFee)).rows;
  const normalizedRows = rows.map((row) => ({ ...row, visit_fee: "visit_fee" in row ? row.visit_fee : null })) as StatisticsRow[];
  const existingYears = normalizedRows.map((row) => Number(row.visit_date.slice(0, 4))).filter(Number.isFinite);
  const years = [...new Set([currentYear, ...existingYears])].sort((left, right) => right - left);

  return {
    currentYear,
    currentMonth,
    financeAvailable,
    years: years.map((year) => {
      const yearRows = normalizedRows.filter((row) => row.visit_date.startsWith(`${year}-`));
      const summary = summarize(yearRows, String(year), `Rok ${year}`);
      return {
        ...summary,
        year,
        months: Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          const key = `${year}-${String(month).padStart(2, "0")}`;
          return summarize(
            yearRows.filter((row) => row.visit_date.startsWith(`${key}-`)),
            key,
            formatMonth(year, month),
          );
        }),
      };
    }),
    allTime: summarize(normalizedRows, "all", "Cały okres"),
  };
}

async function loadRows(fields: string): Promise<{ rows: Array<Record<string, unknown>>; errorCode: string | null }> {
  const rows: Array<Record<string, unknown>> = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const result = await supabaseAdmin
      .from("bookings")
      .select(fields)
      .eq("record_kind", "real")
      .order("visit_date", { ascending: true })
      .range(from, from + pageSize - 1);
    if (result.error) {
      if (result.error.code === "42703") return { rows: [], errorCode: result.error.code };
      throw result.error;
    }
    const page = (result.data ?? []) as unknown as Array<Record<string, unknown>>;
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return { rows, errorCode: null };
}

function summarize(rows: StatisticsRow[], key: string, label: string): PracticePeriodStatistics {
  const completed = rows.filter((row) => row.status === "Zrealizowane");
  const cancelled = rows.filter((row) => row.status === "Odwołane");
  const other = rows.filter((row) => row.status !== "Zrealizowane" && row.status !== "Odwołane");
  const nonCancelled = rows.filter((row) => row.status !== "Odwołane");
  const zielinscy = nonCancelled.filter((row) => getLocationKey(row) === "zielinscy").length;
  const arthro = nonCancelled.filter((row) => getLocationKey(row) === "arthro").length;
  const locationOther = nonCancelled.length - zielinscy - arthro;
  const visitsWithFee = nonCancelled.filter((row) => toFee(row.visit_fee) !== null).length;

  return {
    key,
    label,
    totalVisits: rows.length,
    completedVisits: completed.length,
    cancelledVisits: cancelled.length,
    otherVisits: other.length,
    completionRate: percentage(completed.length, rows.length),
    cancellationRate: percentage(cancelled.length, rows.length),
    completedRevenue: sumFees(completed),
    scheduledValue: sumFees(other),
    completedWithoutFee: completed.filter((row) => toFee(row.visit_fee) === null).length,
    feeCoverageRate: percentage(visitsWithFee, nonCancelled.length),
    locations: {
      zielinscy,
      arthro,
      other: locationOther,
      zielinscyShare: percentage(zielinscy, nonCancelled.length),
      arthroShare: percentage(arthro, nonCancelled.length),
      otherShare: percentage(locationOther, nonCancelled.length),
    },
  };
}

function getLocationKey(row: StatisticsRow) {
  if (row.location_id === "nowa-wies-rzeczna") return "zielinscy";
  if (row.location_id === "arthro-cure-clinic") return "arthro";
  const location = row.location?.toLocaleLowerCase("pl") ?? "";
  if (location.includes("zieliń") || location.includes("nowa wieś")) return "zielinscy";
  if (location.includes("arthro")) return "arthro";
  return "other";
}

function toFee(value: number | string | null) {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sumFees(rows: StatisticsRow[]) {
  return rows.reduce((sum, row) => sum + (toFee(row.visit_fee) ?? 0), 0);
}

function percentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function formatMonth(year: number, month: number) {
  const label = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric", timeZone: "Europe/Warsaw" })
    .format(new Date(Date.UTC(year, month - 1, 15)));
  return label.charAt(0).toLocaleUpperCase("pl") + label.slice(1);
}
