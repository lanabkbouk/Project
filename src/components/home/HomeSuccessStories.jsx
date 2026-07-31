// components/home/HomeSuccessStories.jsx
//
// سكشن "Success Stories": يعرض الفرص المكتملة بنجاح (جايين كـ prop
// من الصفحة). Component عرض بحت بدون أي جلب بيانات هون.

import Typography from "../ui/Typography";
import SuccessStoryCard from "../opportunity/SuccessStoryCard";
import CardSkeleton from "../ui/CardSkeleton";

export default function HomeSuccessStories({ opportunities, loading }) {
  return (
    <section>
      <div className="text-center mb-8">
        <Typography variant="h2" className="mb-2">
          Success Stories
        </Typography>
        <Typography variant="body" className="max-w-xl mx-auto">
          Causes that reached their full team of volunteers and made an impact.
        </Typography>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <SuccessStoryCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : null}
    </section>
  );
}