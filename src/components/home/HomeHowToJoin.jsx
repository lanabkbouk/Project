// components/home/HomeHowToJoin.jsx
//
// سكشن "How to Join": عمودين (متطوع/منظمة) مبنيين على HowToJoinColumn
// الموحّد. البيانات (الخطوات) جاية من constants/homeContent.js.

import Typography from "../ui/Typography";
import HowToJoinColumn from "./HowToJoinColumn";
import { VOLUNTEER_STEPS, ORGANIZATION_STEPS } from "../../constants/homeContent";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";
import { ROUTES, AUTH_QUERY_KEYS } from "../../constants/paths";

export default function HomeHowToJoin() {
  return (
    <section>
      <div className="text-center mb-10">
        <Typography variant="h2" className="mb-2">
          How to Join
        </Typography>
        <Typography variant="body" className="max-w-xl mx-auto">
          Whether you want to volunteer or need volunteers, here's how to get started.
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HowToJoinColumn
          title="For Volunteers"
          description="Find opportunities that match your skills, apply in one click, and track your volunteering journey in one place."
          steps={VOLUNTEER_STEPS}
          ctaLabel="Join as a Volunteer"
          ctaHref={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.VOLUNTEER}`}
          buttonVariant="primary"
        />

        <HowToJoinColumn
          title="For Organizations"
          description="Reach verified volunteers, publish your causes, and manage applicants — all from one dashboard."
          steps={ORGANIZATION_STEPS}
          ctaLabel="Register Your Organization"
          ctaHref={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.ORGANIZATION}`}
          buttonVariant="secondary"
        />
      </div>
    </section>
  );
}