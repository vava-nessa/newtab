# New Tab Dashboard

An ultra-clean, minimal, dark-mode New Tab dashboard built with React, TypeScript, TanStack Query, and Tailwind CSS.

## Features

- **Centered Real-time Clock**: Oversized digital clock display with seconds, live date, and 12h/24h toggle.
- **15-Day Paris Weather**: Real-time Paris weather powered by TanStack Query and Open-Meteo API. Displays current temperature, humidity, wind speed, 15-day forecast cards with colored condition icons, high/low temperatures, precipitation chances, and daily detailed metric modal.
- **Gemini Prompt Form**: Minimal floating prompt input bar with `/` keyboard shortcut, auto-clipboard copy, and direct redirection to Google Gemini.
- **Minimal Shortcuts Dock**: Clean shortcuts to frequent tools (GitHub, Gemini, YouTube, Gmail, DevDocs, Hacker News).
- **Customization**: Temperature unit switcher (°C / °F) and time format toggle (12h / 24h) with localStorage persistence.

## Getting Started

### Installation

```bash
pnpm install
```

### Run Locally

```bash
pnpm dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
pnpm build
```
