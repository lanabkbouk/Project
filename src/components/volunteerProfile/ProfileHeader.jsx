import { Camera } from "lucide-react";
import GenderBadge from "./GenderBadge";

export default function ProfileHeader({ fullName, gender, imagePreview, onImageChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-8 bg-bg">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-primary/30 bg-heading/5">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">
                {fullName?.[0]?.toUpperCase?.() || "V"}
              </div>
            )}
          </div>

          <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center cursor-pointer">
            <span className="sr-only">Upload profile photo</span>
            <Camera size={16} className="text-primary" />
            <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
          </label>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-heading">{fullName}</h1>
          <p className="text-sm md:text-base text-heading/60 mt-1">Volunteer Profile</p>
        </div>
      </div>

      <div className="md:ml-auto">
        <div className="flex flex-col items-end gap-3">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-heading/5 border border-heading/10 px-4 py-3">
            <span className="text-primary font-semibold text-sm">Status</span>
            <span className="text-sm text-heading/70">Active</span>
          </div>

          <GenderBadge gender={gender} />
        </div>
      </div>
    </div>
  );
}