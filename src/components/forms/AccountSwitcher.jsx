import { Link } from "react-router-dom";
import { ROUTES, AUTH_QUERY_KEYS } from "../../constants/paths";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";

export default function AccountSwitch({ accountType }) {
  const isVolunteer = accountType === ACCOUNT_TYPES.VOLUNTEER;

  return (
    <div className="flex bg-heading/5 rounded-lg p-1 mb-6 border border-heading/10">
      <Link
        to={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.VOLUNTEER}`}
        className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition ${
          isVolunteer ? "bg-primary text-white shadow-sm" : "text-body hover:text-heading"
        }`}
      >
        Volunteer
      </Link>

      <Link
        to={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.ORGANIZATION}`}
        className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition ${
          !isVolunteer ? "bg-primary text-white shadow-sm" : "text-body hover:text-heading"
        }`}
      >
        Organization
      </Link>
    </div>
  );
}