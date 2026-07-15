import { Link } from "react-router-dom";
import { ROUTES, AUTH_QUERY_KEYS } from "../../constants/paths";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";

export default function AccountSwitch({ accountType }) {
  const isVolunteer = accountType === ACCOUNT_TYPES.VOLUNTEER;

  return (
    <div className="flex bg-black rounded-lg p-1 mb-6 border border-white/10">
      <Link
        to={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.VOLUNTEER}`}
        className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition ${
          isVolunteer ? "bg-primary text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        Volunteer
      </Link>

      <Link
        to={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.ORGANIZATION}`}
        className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition ${
          !isVolunteer ? "bg-primary text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        Organization
      </Link>
    </div>
  );
}
