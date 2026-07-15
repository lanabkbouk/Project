import { Mail, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import FacebookIcon from "../components/social/FacebookIcon";
import InstagramIcon from "../components/social/InstagramIcon";
import LinkedInIcon from "../components/social/LinkedInIcon";
import SocialIconLink from "../components/social/SocialIconLink";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LogoIcon from "../components/ui/LogoIcon";
import { ROUTES } from "../constants/paths";

const socialLinks = [
  {
    label: "Facebook",
    Icon: FacebookIcon,
    accentClass:
      "bg-[#1877F2] text-white shadow-[0_0_18px_rgba(24,119,242,0.35)]",
    hoverClass:
      "hover:border-[#1877F2]/70 hover:shadow-[0_0_0_4px_rgba(24,119,242,0.15)]",
  },
  {
    label: "Instagram",
    Icon: InstagramIcon,
    accentClass:
      "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-[0_0_18px_rgba(221,42,123,0.28)]",
    hoverClass:
      "hover:border-[#E4405F]/70 hover:shadow-[0_0_0_4px_rgba(221,42,123,0.14)]",
  },
  {
    label: "LinkedIn",
    Icon: LinkedInIcon,
    accentClass:
      "bg-[#0A66C2] text-white shadow-[0_0_18px_rgba(10,102,194,0.3)]",
    hoverClass:
      "hover:border-[#0A66C2]/70 hover:shadow-[0_0_0_4px_rgba(10,102,194,0.14)]",
  },
];

const contactLinks = [
  {
    href: "mailto:info@charity.org",
    icon: Mail,
    text: "info@charity.org",
  },
  {
    href: "tel:+1000000000",
    icon: Phone,
    text: "+1 (000) 000-0000",
  },
];

const quickLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Opportunities", to: ROUTES.PARTICIPATES },
  { label: "Organization", to: ROUTES.ORGANIZATION_PROFILE },
  { label: "About Us", to: ROUTES.ABOUT },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <NavLink
            to={ROUTES.HOME}
            className="inline-flex items-center space-x-3 rtl:space-x-reverse transition hover:opacity-90"
          >
            <LogoIcon className="h-6 w-6" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
              Charity
            </span>
          </NavLink>

          <p className="mt-3 max-w-md text-sm text-white/70">
            Connecting volunteers with organizations to create a positive
            community impact.
          </p>

          <div className="mt-6 flex flex-col gap-2 text-sm text-white/70">
            {contactLinks.map((contact) => (
              <a
                key={contact.href}
                className="inline-flex items-center gap-2 hover:text-primary"
                href={contact.href}
              >
                <contact.icon className="h-4 w-4 text-primary" />
                <span>{contact.text}</span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => (
              <SocialIconLink key={social.label} href="#" {...social} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `transition hover:text-primary ${
                      isActive ? "text-primary" : "text-white/70"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            Newsletter
          </p>
          <p className="mb-5 text-sm text-white/70">
            Get updates about new opportunities and community news.
          </p>

          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-start"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Email address"
              type="email"
              variant="default"
              fullWidth
              className="h-11 rounded-xl bg-black/30 text-sm placeholder:text-white/40"
              required
            />
            <Button
              size="medium"
              className="h-11 w-full rounded-xl px-5 text-sm font-medium sm:w-auto"
              type="submit"
            >
              Subscribe
            </Button>
          </form>

          <p className="mt-3 text-xs text-white/50">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Charity. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <NavLink
              className="hover:text-primary"
              to={ROUTES.ABOUT}
              aria-label="Privacy Policy"
            >
              Privacy
            </NavLink>
            <NavLink
              className="hover:text-primary"
              to={ROUTES.ABOUT}
              aria-label="Terms of Service"
            >
              Terms
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
