import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useContactModal } from "@/hooks/use-contact-modal";
import { useTheme } from "@/hooks/use-theme";
import { Menu, X, Sun, Moon } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { openModal } = useContactModal();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let prev = false;
    const handleScroll = () => {
      const isPast = window.scrollY > 20;
      if (isPast !== prev) {
        prev = isPast;
        setScrolled(isPast);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "<about>", href: "/about" },
    { label: "<work>", href: "/work" },
    { label: "<services>", href: "/services" },
    { label: "<stories>", href: "/stories" },
    { label: "<careers>", href: "/careers" },
  ];

  return (
    <nav
      className={`fixed left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 shadow-lg shadow-black/5 border-b border-border backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{ top: "0px" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-foreground cursor-pointer">
          <img 
            src="/assets/tg-logo.png" 
            alt="Time Global Logo" 
            width="32"
            height="32"
            className="w-8 h-8 object-contain dark:invert-0 light-logo-filter"
          />
          Time Global
        </Link>

        {/* Desktop — industry pills */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/services#services-breakdown"
            className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold tracking-wide border border-primary/20 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:scale-[1.03] active:scale-[0.98]"
            title="Explore Web & Software Development Services"
          >
            Web & Software
          </Link>
          <Link
            href="/services#services-breakdown"
            className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold tracking-wide border border-primary/20 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:scale-[1.03] active:scale-[0.98]"
            title="Explore AI & Automation Solutions"
          >
            AI & Automation
          </Link>
        </div>

        {/* Desktop — nav links */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-sm text-muted-foreground">
          {navLinks.map((link) => (
            link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} className={`${location === link.href ? "text-primary font-bold" : "text-muted-foreground"} hover:text-primary transition-colors duration-200 cursor-pointer`}>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`${location === link.href ? "text-primary font-bold" : "text-muted-foreground"} hover:text-primary transition-colors duration-200`}
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Desktop — theme toggle + CTA */}
         <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <CtaButton onClick={openModal} data-testid="button-lets-talk-nav" size="md">
            let's talk
          </CtaButton>
        </div> 

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              <div className="flex gap-3">
                <Link
                  href="/services#services-breakdown"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                >
                  Web & Software
                </Link>
                <Link
                  href="/services#services-breakdown"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                >
                  AI & Automation
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}
                      className={`font-mono text-base ${location === link.href ? "text-primary font-bold" : "text-muted-foreground"} hover:text-primary transition-colors cursor-pointer`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}
                      className={`font-mono text-base ${location === link.href ? "text-primary font-bold" : "text-muted-foreground"} hover:text-primary transition-colors`}
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>
              <CtaButton
                onClick={() => { setIsOpen(false); openModal(); }}
                className="mt-2 w-full"
              >
                let's talk
              </CtaButton> 
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
