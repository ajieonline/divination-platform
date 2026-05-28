import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all hover:bg-purple-800/30"
        style={{ color: "rgba(196,181,253,0.8)" }}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full right-0 mt-2 py-2 rounded-xl z-50 w-36"
            style={{
              background: "rgba(15,8,40,0.98)",
              border: "1px solid rgba(217,70,239,0.3)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLang(l.code)}
                className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-all hover:bg-purple-900/30"
                style={{
                  color:
                    i18n.language === l.code ? "#e9d5ff" : "rgba(196,181,253,0.8)",
                  background:
                    i18n.language === l.code
                      ? "rgba(162,28,175,0.2)"
                      : "transparent",
                }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {i18n.language === l.code && (
                  <span className="ml-auto text-purple-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
