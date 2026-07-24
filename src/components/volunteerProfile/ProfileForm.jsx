import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { MapPin, User2 } from "lucide-react";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Textarea from "../ui/Textarea"; 
import Button from "../ui/Button"; 
import { fetchAvailableSkills } from "../../services/skills";

import {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  CATEGORY_SELECTED_COLORS
} from "../../utils/categoryStyles";

const GENDER_ITEMS = [
  { name: "Female", value: "Female" },
  { name: "Male", value: "Male" },
];

const GOVERNORATE_ITEMS = [
  "Damascus",
  "Rif Dimashq (Damascus Countryside)",
  "Aleppo",
  "Homs",
  "Hama",
  "Latakia",
  "Tartus",
  "Idlib",
  "Raqqa",
  "Deir ez-Zor",
  "Al-Hasakah",
  "Daraa",
  "As-Suwayda",
  "Quneitra",
].map((name) => ({ name, value: name.startsWith("Rif Dimashq") ? "Rif Dimashq" : name }));

export default function ProfileForm({ submitting }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSkills() {
      try {
        const skills = await fetchAvailableSkills();
        if (isMounted) setAvailableSkills(skills);
      } catch (err) {
        console.error("Failed to load skills:", err);
      } finally {
        if (isMounted) setSkillsLoading(false);
      }
    }

    loadSkills();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Education Level"
          name="educationLevel"
          register={register}
          placeholder="e.g. Bachelor, High School"
          variant="filled"
          error={errors.educationLevel?.message}
          fullWidth
        />

        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          register={register}
          variant="filled"
          error={errors.dateOfBirth?.message}
          fullWidth
        />

        <div className="flex flex-col gap-1">
          <label className="mb-1 text-sm font-medium text-heading">Your Gender</label>
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={GENDER_ITEMS}
                value={value}
                onChange={onChange}
                placeholder="Select your gender"
                icon={User2}
                variant="filled"
                error={errors.gender?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="mb-1 text-sm font-medium text-heading">Governorate of Residence</label>
          <Controller
            name="city"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={GOVERNORATE_ITEMS}
                value={value}
                onChange={onChange}
                placeholder="Choose your governorate"
                icon={MapPin}
                variant="filled"
                error={errors.city?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium mb-2 text-heading">Skills</label>
        <p className="text-xs text-heading/50 mb-3">Select at least one skill from the list</p>

        {skillsLoading ? (
          <p className="text-sm text-heading/50">Loading skills...</p>
        ) : (
          <Controller
            name="skills"
            control={control}
            defaultValue={[]}
            render={({ field: { value = [], onChange } }) => {

              // 🔥 تقسيم المهارات حسب التصنيف الديناميكي
              const grouped = availableSkills.reduce((acc, skill) => {
                const category = skill.category?.name || "Other";
                if (!acc[category]) acc[category] = [];
                acc[category].push(skill);
                return acc;
              }, {});

              return (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([category, skills]) => {
                    const Icon = CATEGORY_ICONS[category];
                    const color = CATEGORY_COLORS[category];

                    return (
                      <div
                        key={category}
                        className="rounded-lg border border-heading/10 bg-white p-3 shadow-sm"
                      >
                        {/* Category Header */}
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${color}`}
                          >
                            {Icon && <Icon size={14} />}
                            {category}
                          </span>
                          <div className="h-px flex-1 bg-heading/10"></div>
                        </div>

                        {/* Skills List */}
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => {
                            const isSelected = value.includes(skill.id);
                            const selectedClass =
                              CATEGORY_SELECTED_COLORS[category] ||
                              "bg-primary text-white border-primary";

                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() =>
                                  onChange(
                                    isSelected
                                      ? value.filter((id) => id !== skill.id)
                                      : [...value, skill.id]
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                                  isSelected
                                    ? selectedClass
                                    : "bg-gray-50 text-heading/70 border-heading/15 hover:border-primary/50"
                                }`}
                              >
                                {skill.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        )}

        {errors.skills && (
          <p className="mt-2 text-xs text-red-500">{errors.skills.message}</p>
        )}
      </div>

      <Input
        label="Interests"
        name="interests"
        register={register}
        placeholder="Comma separated (e.g. Education, Medical Aid)"
        variant="filled"
        fullWidth
      />

      <Textarea
        label="About"
        name="about"
        rows={5}
        register={register}
        placeholder="Write a short intro about yourself..."
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
        <Button type="submit" isLoading={submitting}>
          {submitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
