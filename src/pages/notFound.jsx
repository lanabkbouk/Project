
// صفحة 404 الرسمية — تستبدل الـ <div>Page not found</div> الخام يلي كان
// موجود مباشرة بملف App.jsx. مبنية بنفس هوية باقي الصفحات (Typography +
// Button + نفس المسافات)، وتُعرض جوا MainLayout فيصير عندها Navbar/Footer
// عاديين بدل ما تظهر كصفحة يتيمة بدون أي تنقّل.

import { Link, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/paths";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Compass size={30} className="text-primary" aria-hidden="true" />
      </div>

      <Typography variant="overline" color="primary">
        Error 404
      </Typography>

      <Typography variant="display" className="!text-5xl sm:!text-6xl">
        Page not found
      </Typography>

      <Typography variant="lead" className="max-w-md text-body">
        The page you're looking for doesn't exist or may have moved. Check the
        address, or head back to a page that does.
      </Typography>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button as={Link} to={ROUTES.HOME} variant="primary" size="large">
          Back to Home
        </Button>
        <Button variant="ghost" size="large" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
}