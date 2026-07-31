import { useFormContext, Controller } from "react-hook-form";
import { MapPin, User2, GraduationCap } from "lucide-react";

import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Skeleton from "../ui/Skeleton";

import {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  CATEGORY_SELECTED_COLORS
} from "../../utils/categoryStyles";

const GENDER_ITEMS = [
  { name: "Female", value: "Female" },
  { name: "Male", value: "Male" },
];

const EDUCATION_LEVEL_ITEMS = [
  { name: "No Formal Education", value: "No Formal Education" },
  { name: "High School", value: "High School" },
  { name: "Diploma", value: "Diploma" },
  { name: "Bachelor's Degree", value: "Bachelor's Degree" },
  { name: "Master's Degree", value: "Master's Degree" },
  { name: "PhD", value: "PhD" },
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

export default function ProfileForm({ submitting, availableSkills = [], skillsLoading = false }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-7">

      {/* ===========================
          Basic Info
      ============================ */}
      <Typography variant="h3" gutterBottom>
        Basic Information
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Controller
          name="educationLevel"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Education Level"
              items={EDUCATION_LEVEL_ITEMS}
              value={value}
              onChange={onChange}
              placeholder="Select your education level"
              icon={GraduationCap}
              error={errors.educationLevel?.message}
            />
          )}
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

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Your Gender"
              items={GENDER_ITEMS}
              value={value}
              onChange={onChange}
              placeholder="Select your gender"
              icon={User2}
              error={errors.gender?.message}
            />
          )}
        />

        {/* Governorate */}
        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Governorate of Residence"
              items={GOVERNORATE_ITEMS}
              value={value}
              onChange={onChange}
              placeholder="Choose your governorate"
              icon={MapPin}
              error={errors.city?.message}
            />
          )}
        />
      </div>

      {/* ===========================
          Skills Section
      ============================ */}
      <Typography variant="h3" gutterBottom>
        Skills
      </Typography>

      <Typography variant="caption" color="muted" gutterBottom>
        Select at least one skill from the list
      </Typography>

      {skillsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div key={groupIndex} className="rounded-xl border border-heading/10 bg-field p-4">
              <Skeleton className="h-5 w-28 mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, chipIndex) => (
                  <Skeleton key={chipIndex} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Controller
          name="skills"
          control={control}
          defaultValue={[]}
          render={({ field: { value = [], onChange } }) => {
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
                      className="rounded-xl border border-heading/10 bg-field p-4 shadow-sm"
                    >
                      {/* Category Header */}
                      <div className="mb-3 flex items-center gap-2">
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
                            "bg-primary text-bg border-primary";

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
                                  : "bg-field text-heading/70 border-heading/15 hover:border-primary/50"
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
        <Typography variant="caption" color="danger">
          {errors.skills.message}
        </Typography>
      )}

      {/* Interests */}
      <Input
        label="Interests"
        name="interests"
        register={register}
        placeholder="Comma separated (e.g. Education, Medical Aid)"
        variant="filled"
        fullWidth
      />

      {/* About */}
      <Textarea
        label="About"
        name="about"
        rows={5}
        register={register}
        placeholder="Write a short intro about yourself..."
      />

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
        <Button type="submit" isLoading={submitting}>
          {submitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}