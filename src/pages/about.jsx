import MissionSection from "../components/about/MissionSection";
import SectionHeader from "../components/about/SectionHeader";
import StatsGrid from "../components/about/StatsGrid";
import ValuesGrid from "../components/about/ValuesGrid";
import VisionGoals from "../components/about/VisionGoals";

export default function AboutPage() {
  const statsArray = [
    { number: 1240, label: "Active Volunteers" },
    { number: 86, label: "Organizations" },
    { number: 312, label: "Opportunities" },
    { number: 45, label: "Cities Covered" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-[#0f0f0f] px-6 py-16">

      {/* Grid Lines Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      <div className="relative container mx-auto">
        <SectionHeader />

        <div className="h-px w-full bg-white/10 my-16" />

        <MissionSection volunteers={1240} />

        <div className="h-px w-full bg-white/10 my-16" />

        <StatsGrid stats={statsArray} />

        <div className="h-px w-full bg-white/10 my-16" />

        <ValuesGrid />

        <div className="h-px w-full bg-white/10 my-16" />

        <VisionGoals />
      </div>
    </div>
  );
}
