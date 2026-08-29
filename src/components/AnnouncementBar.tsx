import { useState } from "react";
import { SiAnthropic, SiGoogle } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { X } from "lucide-react";

const AI_NEWS = [
  {
    text: "Anthropic: in US valuation nears $1tn",
    url: "https://www.investopedia.com/anthropic-s-valuation-jumped-to-nearly-usd1-trillion-here-s-what-that-means-for-the-ipo-market-11986653",
    icon: SiAnthropic,
    color: "text-[#D97757]"
  },
  {
    text: "Microsoft: unveiled seven in-house AI models claims to beat Claude & Google's Nano Banana",
    url: "https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html",
    icon: FaMicrosoft,
    color: "text-[#00A4EF]"
  },
  {
    text: "Anthropic: Announcements Expanding Project Glasswing",
    url: "https://www.anthropic.com/news/expanding-project-glasswing",
    icon: SiAnthropic,
    color: "text-[#D97757]"
  },
  {
    text: "Google: Introducing Gemma 4 12B a unified, encoder-free multimodal model",
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12b/",
    icon: SiGoogle,
    color: "text-[#4285F4]"
  }
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("announcement-dismissed") === "true"
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("announcement-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-12 bg-secondary/95 dark:bg-secondary/95 backdrop-blur-sm border-b border-white/5 text-secondary-foreground text-base overflow-hidden flex items-center whitespace-nowrap">
      <div className="flex animate-[ticker_120s_linear_infinite] items-center gap-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center">
            {AI_NEWS.map((news, idx) => (
              <span key={idx} className="mx-12 font-display font-semibold tracking-tight shrink-0 flex items-center gap-4">
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                  <span className="text-primary text-[11px] uppercase font-bold tracking-widest">Live Updates</span>
                </span>
                <a 
                  href={news.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-3 transition-all duration-300 group"
                >
                  <news.icon className={`${news.color} text-lg group-hover:scale-110 transition-transform`} />
                  <span className="underline decoration-primary/20 underline-offset-4 group-hover:decoration-primary/50">
                    {news.text}
                  </span>
                </a>
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-\\[ticker_120s_linear_infinite\\]:hover {
          animation-play-state: paused;
        }
      `}</style>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-secondary-foreground/60 hover:text-secondary-foreground shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
