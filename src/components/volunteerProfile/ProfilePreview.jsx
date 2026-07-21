import { useFormContext } from "react-hook-form";
import InfoRow from "../ui/InfoRow";
import Chip from "../ui/Chip";
import { calculateAge } from "../../utils/validators";

const splitCsvToChips = (input) => {
  if (!input) return [];
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export default function ProfilePreview({ fullName, email, availableSkillsMap }) {
  const { watch } = useFormContext();

  // watch() بيرجع كل قيم الفورم الحية بدون ما نكرر الـ state
  const values = watch();

  const age = calculateAge(values.dateOfBirth);
  const isAdult = age !== null && age >= 18;

  const selectedSkillNames = (values.skills || []).map(
    (id) => availableSkillsMap?.[id] || id
  );
  const interestsChips = splitCsvToChips(values.interests);

  return (
    <div className="rounded-3xl bg-heading/5 border border-heading/10 p-6 md:p-8">
      <h2 className="text-lg font-semibold mb-4 text-heading">Preview</h2>

      <div className="space-y-4">
        <InfoRow label="Full Name" value={fullName} />
        <InfoRow label="Email" value={email} />
        <InfoRow label="Education Level" value={values.educationLevel} />
        {/* تاريخ الميلاد يظهر بس لو العمر 18+ */}
        {isAdult && <InfoRow label="Date of Birth" value={values.dateOfBirth} />}
        <InfoRow label="Gender" value={values.gender} />
        <InfoRow label="City" value={values.city} />

        <div className="pt-2 border-t border-heading/10">
          <h3 className="font-semibold mb-2 text-heading">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(selectedSkillNames.length ? selectedSkillNames : ["—"]).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-heading/10">
          <h3 className="font-semibold mb-2 text-heading">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {(interestsChips.length ? interestsChips : ["—"]).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-heading/10">
          <h3 className="font-semibold mb-2 text-heading">About</h3>
          <p className="text-sm text-heading/80 leading-relaxed">
            {values.about || "Write something about yourself to appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}