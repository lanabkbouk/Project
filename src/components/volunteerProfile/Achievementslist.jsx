import { useEffect, useState } from "react";
import { fetchVolunteerAchievements } from "../../services/achievements";

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchVolunteerAchievements();
        if (isMounted) setAchievements(data);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-heading/50">Loading achievements...</p>;
  }

  if (achievements.length === 0) {
    return (
      <p className="text-sm text-heading/50">
        No achievements yet. Start volunteering to earn your first badge!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl bg-bg border border-heading/10 p-5 flex flex-col gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            🏅
          </div>
          <h3 className="font-semibold text-heading">{item.name}</h3>
          <p className="text-xs text-heading/50">{item.type}</p>
          <p className="text-xs text-heading/40">{item.date}</p>
        </div>
      ))}
    </div>
  );
}