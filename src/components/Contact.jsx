import { useState, useEffect } from "react";
import { Mail, ArrowUpRight } from "lucide-react";
import config from "./config.json";

const LANG_KEY = "portfolio_lang";

function getStoredLang(languages) {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && languages.includes(stored) ? stored : languages[0];
  } catch {
    return languages[0];
  }
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.27-.01-1.16-.02-2.1-3.34.71-4.04-1.4-4.04-1.4-.55-1.36-1.34-1.72-1.34-1.72-1.09-.72.08-.71.08-.71 1.2.08 1.84 1.21 1.84 1.21 1.07 1.78 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.29-5.47-1.29-5.47-5.75 0-1.27.47-2.31 1.24-3.12-.13-.29-.54-1.46.12-3.05 0 0 1.01-.31 3.3 1.19a11.7 11.7 0 0 1 3-.39c1.02 0 2.05.13 3 .39 2.29-1.5 3.3-1.19 3.3-1.19.66 1.59.25 2.76.12 3.05.77.81 1.24 1.85 1.24 3.12 0 4.47-2.81 5.45-5.49 5.74.43.36.81 1.07.81 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.83.56A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

const socialIcons = {
  github: GithubIcon,
};

export default function ContactSection() {
  const languages = Object.keys(config);
  const [lang, setLang] = useState(() => getStoredLang(languages));

  useEffect(() => {
    const handler = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const t = config[lang]?.contact;
  const f = config[lang]?.footer;
  const nav = config[lang]?.nav;

  if (!t) return null;

  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-slate-950 text-slate-300 font-sans scroll-mt-28 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none" />

      {/* Call to action */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 flex flex-col items-center text-center gap-7">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-[0.18em] border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t.availability}
        </span>

        <h2 className="text-4xl md:text-6xl font-bold text-slate-50 tracking-tight leading-[1.1] max-w-3xl">
          {t.title}
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
          {t.description}
        </p>

        <a
          href={`mailto:${t.email}`}
          className="group mt-2 inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-base md:text-lg px-8 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)] transition-colors"
        >
          <Mail size={20} />
          {t.email}
          <ArrowUpRight
            size={20}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>

        {t.socials?.length > 0 && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold">
              {t.socialsLabel}
            </span>
            <div className="flex items-center gap-4">
              {t.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : s.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold text-slate-100 text-lg">{nav?.logo}</span>
            <span className="text-sm text-slate-500 max-w-xs text-center md:text-left">
              {f?.tagline}
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {nav?.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>
            © {year} {nav?.logo} {f?.rights}
          </span>
          <span>{f?.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
