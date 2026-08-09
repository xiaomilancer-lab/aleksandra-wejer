import { Heart, Star } from "lucide-react";
import type { PatientReviewCare } from "../../domain";
import DashboardCard from "../DashboardCard";
import PsycholkaGentleCelebration from "../PsycholkaGentleCelebration";
import PsycholkaWidget from "../PsychOLKAWidget";

type ReviewCareOverviewProps = {
  reviews: PatientReviewCare[];
  loadError: boolean;
};

export default function ReviewCareOverview({ reviews, loadError }: ReviewCareOverviewProps) {
  const googleReviews = reviews.filter((review) => review.review_response === "google");
  const privateFeedback = reviews.filter((review) => review.private_feedback);

  return (
    <div>
      <PsycholkaGentleCelebration eventKey="first-google-review" enabled={googleReviews.length === 1} />
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Care After Visit</p>
        <h1 className="mt-1 text-3xl font-bold text-[#2D4739]">Opinie</h1>
        <p className="mt-2 text-gray-600">Prośba o opinię może zostać zaplanowana tylko raz dla każdego pacjenta.</p>
        {googleReviews.length === 1 && <div className="mt-3"><PsycholkaWidget context="review" mood="celebrate" action="greeting" className="max-w-fit" /></div>}
      </div>

      {loadError ? <p className="rounded-2xl border border-[#E5E1D8] bg-[#FFF9EE] px-5 py-4 text-sm text-[#7A6540]">Opinie są chwilowo niedostępne. Spróbuj odświeżyć stronę za moment.</p> : <div className="grid gap-6 xl:grid-cols-2"><ReviewGroup icon={Star} title="Google" description="Pacjenci, którzy wybrali przejście do opinii Google." items={googleReviews} emptyMessage="Pierwsze odpowiedzi Google pojawią się tutaj." /><ReviewGroup icon={Heart} title="Prywatne uwagi" description="Wiadomości widoczne wyłącznie w panelu gabinetu." items={privateFeedback} emptyMessage="Prywatne uwagi od pacjentów pojawią się tutaj." privateFeedback /></div>}
    </div>
  );
}

function ReviewGroup({ icon: Icon, title, description, items, emptyMessage, privateFeedback = false }: { icon: typeof Star; title: string; description: string; items: PatientReviewCare[]; emptyMessage: string; privateFeedback?: boolean }) {
  return <DashboardCard><div className="flex items-center gap-3"><span className={`rounded-2xl p-3 ${privateFeedback ? "bg-[#FBE8E8] text-[#BF4D4D]" : "bg-[#FFF4D9] text-[#B7791F]"}`}><Icon size={20} aria-hidden="true" /></span><div><h2 className="font-bold text-[#2D4739]">{title}</h2><p className="text-sm text-gray-500">{description}</p></div></div><div className="mt-5 space-y-3">{items.length === 0 ? <p className="rounded-2xl bg-[#F8F5F0] px-4 py-5 text-sm text-gray-600">{emptyMessage}</p> : items.map((item) => <article key={item.id} className="rounded-2xl bg-[#F8F5F0] p-4"><p className="font-semibold text-[#2D4739]">{item.name}</p>{privateFeedback ? <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{item.private_feedback}</p> : <p className="mt-2 text-sm text-gray-600">Kliknięto link do opinii {item.google_review_clicked_at ? `· ${new Date(item.google_review_clicked_at).toLocaleDateString("pl-PL")}` : ""}</p>}</article>)}</div></DashboardCard>;
}
