import { useEffect, useState } from "react";
import { fetchVolunteerAchievements } from "../../services/achievements";
import AchievementCard from "./AchievementCard";

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchVolunteerAchievements();
        if (isMounted) setAchievements(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load achievements");
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

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
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
        <AchievementCard key={item.id} achievement={item} />
      ))}
    </div>
  );
}