import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { getUserDisplayName } from "../utils/auth/displayName";

import ProfileHeader from "../components/volunteerProfile/ProfileHeader";
import ProfileForm from "../components/volunteerProfile/ProfileForm";
import ProfilePreview from "../components/volunteerProfile/ProfilePreview";
import { profileSchema } from "../utils/auth/VolunteerProfileValidation";

const normalizeGenderFromUser = (gender) => {
  if (!gender) return "";
  const g = String(gender).toLowerCase();
  if (g === "female" || g === "f") return "Female";
  if (g === "male" || g === "m") return "Male";
  if (g.includes("prefer") || g.includes("not")) return "Prefer not to say";
  return gender;
};

export default function VolunteerProfile() {
  const { user, updateUser } = useAuth();

  const [imagePreview, setImagePreview] = useState(
    user?.imageUrl || ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo(
    () => ({
      educationLevel: user?.educationLevel || "",
      dateOfBirth: user?.dateOfBirth || user?.dob || "",
      gender: normalizeGenderFromUser(user?.gender),
      city: user?.city || "",
      skills: Array.isArray(user?.skillIds) ? user?.skillIds : [],
      interests: Array.isArray(user?.interests)
        ? user?.interests.join(", ")
        : user?.interests || "",
      about: user?.about || user?.bio || "",
    }),
    [user]
  );

  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const fullName = getUserDisplayName(user);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(file);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const formData = new FormData();

      // رفع الصورة
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // رفع باقي البيانات
      formData.append("educationLevel", data.educationLevel);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("city", data.city);
      formData.append("skills", JSON.stringify(data.skills));
      formData.append("interests", data.interests);
      formData.append("about", data.about);

      // إرسال للباك (عدّلي الرابط حسب API الخاص بك)
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      // حفظ البيانات في الـ Context
      updateUser({
        ...data,
        imageUrl: result.imageUrl, // الرابط القادم من الباك
      });

      // تفريغ الحقول والصورة
      methods.reset({
        educationLevel: "",
        dateOfBirth: "",
        gender: "",
        city: "",
        skills: [],
        interests: "",
        about: "",
      });

      setImagePreview("");
      setImageFile(null);

    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-bg text-heading">
        <div className="container mx-auto px-4 md:px-16 py-10 md:py-14">
          <ProfileHeader
            fullName={fullName}
            gender={methods.watch("gender")}
            imagePreview={imagePreview}
            onImageChange={onImageChange}
          />

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 rounded-3xl bg-heading/5 border border-heading/10 p-6 md:p-8">
              <ProfileForm submitting={submitting} />
            </div>

            <ProfilePreview fullName={fullName} email={user?.email} />
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
