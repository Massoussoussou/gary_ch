# -*- coding: utf-8 -*-
from pathlib import Path
import re

path = Path('src/pages/BuyIntro.jsx')
text = path.read_text(encoding='utf-8')

old_return = '  return (\n    <main className="min-h-screen text-[#0F1115] overflow-x-clip">'
new_return = '  return (\n    <div className="relative">\n      <div\n        aria-hidden\n        className="fixed inset-0 -z-20 h-[100svh] pointer-events-none overflow-hidden"\n      >\n        <img\n          src="/media/hero-poster.webp"\n          alt=""\n          width="1920"\n          height="1080"\n          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}\n          fetchpriority="high"\n          decoding="async"\n        />\n        <video\n          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}\n          autoPlay\n          muted\n          loop\n          playsInline\n          preload="metadata"\n          poster="/media/hero-poster.webp"\n          onLoadedData={() => setReady(true)}\n          onCanPlay={() => setReady(true)}      // fallback\n          onError={(e) => console.warn("Video error", e)}\n          aria-hidden="true"\n        >\n          <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />\n          <source\n            src={src.endsWith(".webm") ? src.replace(".webm", ".mp4") : src.replace(".mp4", ".webm")}\n            type={src.endsWith(".webm") ? "video/mp4" : "video/webm"}\n          />\n        </video>\n      </div>\n      <main className="relative z-10 min-h-screen text-[#0F1115] overflow-x-clip">'

if old_return not in text:
    raise SystemExit('Expected main start snippet not found')
text = text.replace(old_return, new_return, 1)

pattern = r'      {/* BACKGROUND */}\r?\n.*?      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 py-20 md:py-28"'
match = re.search(pattern, text, flags=re.S)
if not match:
    raise SystemExit('Expected background block not found')

overlay_block = '      {/* Calques overlay pour lisibilité */}\n      <div className="absolute inset-0">\n        <div className="absolute inset-0 bg-black/10" />\n        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />\n        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />\n      </div>\n\n      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 py-20 md:py-28"'
text = text[:match.start()] + overlay_block + text[match.end():]

closing_old = '    </main>\n  );'
closing_new = '    </main>\n  </div>\n  );'
if closing_old not in text:
    raise SystemExit('Expected closing snippet not found')
text = text.replace(closing_old, closing_new, 1)

path.write_text(text, encoding='utf-8')
