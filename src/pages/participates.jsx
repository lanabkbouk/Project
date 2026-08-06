import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import Typography from "../components/ui/Typography";
import ParticipationCard from "../components/opportunity/ParticipationCard";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/common/EmptyState";
import ShowMoreButton from "../components/common/ShowMoreButton";
import { useMyParticipationsQuery } from "../hooks/queries/useMyParticipationsQuery";
import { useShowMore } from "../hooks/useShowMore";
import { markHoursSeen } from "../utils/hoursSeenTracker";
import { markStatusSeen } from "../utils/participationStatusSeenTracker";
import { PARTICIPATION_STATUS } from "../constants/participationStatus";
import { CARD_SURFACE } from "../utils/surfaceStyles";
import { ROUTES } from "../constants/paths";

export default function Participates() {
  const navigate = useNavigate();
  const participationsQuery = useMyParticipationsQuery();

  const participations = useMemo(() => participationsQuery.data ?? [], [participationsQuery.data]);
  const { visibleItems: visibleParticipations, hasMore, remainingCount, showMore } = useShowMore(participations);
  const loading = participationsQuery.isPending;
  const error = participationsQuery.isError
    ? participationsQuery.error?.message || "Failed to load your volunteering history"
    : "";

  // تعليم كل الساعات المؤكدة وحالات القبول/الرفض الظاهرة هلق
  // كـ"مشاهدة" — بعد هالسطر، النقطة الحمراء بالنافبار بتختفي لحد ما
  // يظهر تحديث جديد فعليًا
  useEffect(() => {
    participations.forEach((participation) => {
      if (participation.hoursLogged !== null && participation.hoursLogged !== undefined) {
        markHoursSeen(participation.id, participation.hoursLogged);
      }
      if (
        participation.status === PARTICIPATION_STATUS.ACCEPTED ||
        participation.status === PARTICIPATION_STATUS.REJECTED
      ) {
        markStatusSeen(participation.id, participation.status);
      }
    });
  }, [participations]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Typography variant="sectionTitle" className="mb-2">
        My Volunteering
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        Track the opportunities you've joined and your progress so far.
      </Typography>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${CARD_SURFACE} p-5 flex flex-col gap-3`}>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : participations.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="You haven't joined any opportunities yet"
          description="Browse open opportunities that match your skills and start making an impact today."
          actionLabel="Explore Opportunities"
          onAction={() => navigate(ROUTES.EXPLORE)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {visibleParticipations.map((participation) => (
            <ParticipationCard key={participation.id} participation={participation} />
          ))}

          {hasMore && <ShowMoreButton remainingCount={remainingCount} onClick={showMore} />}
        </div>
      )}
    </div>
  );
}