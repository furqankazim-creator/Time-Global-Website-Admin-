import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { 
  FaLinkedinIn, 
  FaGithub, 
  FaFacebookF, 
  FaInstagram, 
  FaPinterestP, 
  FaTiktok, 
  FaYoutube 
} from "react-icons/fa";

// Mirrors the navbar — the footer used to omit about/blog/awards entirely.
const NAV_LINKS = [
  { label: "<about>", href: "/about" },
  { label: "<case studies>", href: "/work" },
  { label: "<services>", href: "/services" },
  { label: "<stories>", href: "/stories" },
  { label: "<blog>", href: "/blog" },
  { label: "<awards>", href: "/awards" },
  { label: "<careers>", href: "/careers" },
];

// These were plain text; "#services" is not a section on most pages.
const SERVICES_LINKS = [
  "Web Application Development",
  "Mobile App Development",
  "AI & Cloud Solutions",
  "Project Consulting",
  "System Integrations",
];

const SOCIAL = [
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/company/timeglobaltech" },
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/timeglobaltech/" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/timeglobaltech/" },
    { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@timeglobaltech" },
  { icon: FaTiktok, label: "TikTok", href: "https://www.tiktok.com/@time.global.tech" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/timeglobaltech" },
  { icon: FaPinterestP, label: "Pinterest", href: "https://www.pinterest.com/timeglobaltech/" },

];

export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight mb-5">
              <img 
                src="/assets/tg-logo.png" 
                alt="Time Global Logo" 
                width="28"
                height="28"
                className="w-7 h-7 object-contain"
              />
              Time Global
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-[220px]">
              Delivering world-class software solutions globally. Precision, ambition, and expertise encoded in every project.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-widest mb-5">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-widest mb-5">Services</h4>
            <ul className="flex flex-col gap-3">
              {SERVICES_LINKS.map((svc) => (
                <li key={svc}>
                  <Link
                    href="/services"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:info@timeglobaltech.com"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-primary" />
                  info@timeglobaltech.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923148455430?text=I%20visited%20your%20website%20and%20would%20like%20to%20connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle size={15} className="mt-0.5 shrink-0 text-primary" />
                  +92 314 8455430
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>Bungalow Office #1/2-L, Block 6, PECHS Society<br />Shahrah-e-Faisal, PECHS, Karachi, 75350</span>
              </li>
            </ul>

            
          </div>
        </div>
      </div>

      {/* Social links row */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-8">
          <span className="text-muted-foreground text-sm font-medium">Follow us:</span>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-xs">
            © 2013 to {new Date().getFullYear()} Time Global — AI based Software Development Agency — Pakistan Registered —{" "}
            <a
              href="https://www.pseb.org.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
            >
              PSEB
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer">
              Terms
            </Link>
            <Link href="/cookie-policy" className="text-xs text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer">
              Cookie Policy
            </Link>
            <Link href="/refund-policy" className="text-xs text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
