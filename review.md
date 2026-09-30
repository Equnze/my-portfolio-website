# Code Review: Okechukwu Ikwunze Portfolio

**Date:** 30 September 2026
**Scope:** All project source and configuration in `c:\Users\okech\Desktop\SITE`
**Files reviewed:** `app/page.tsx`, `app/layout.tsx`, `app/components/ChatTwin.tsx`, `app/api/chat/route.ts`, `app/globals.css`, `next.config.mjs`, `package.json`, `tsconfig.json`, `.env`, `..gitignore`, `tutorial.md`
**Code changes made during review:** None

---

## 1. Executive Summary

The site builds cleanly (`npm run build` and `tsc --noEmit` both pass), renders well on desktop and mobile, and keeps the OpenRouter API key on the server. The overall architecture is right for a small portfolio: one page, one client-side chat component, and one server API route.

There are problems to fix before the site goes public or into version control. In priority order:

1. **Secrets are not protected.** The ignore file is misnamed `..gitignore`, so git will not ignore `.env`. The API key has also been shown in plaintext during this development session, so it should be rotated.
2. **The chat endpoint has no abuse controls.** Anyone who can reach `/api/chat` can spend OpenRouter credit without limit, and the browser controls the full conversation history, including "assistant" turns.
3. **Accessibility gaps.** Some text is 6–8px, the hidden mobile menu can still be reached with the keyboard, and the chat has no Escape-to-close or focus management.
4. **Maintainability.** About 2,000 of the 2,811 lines in `globals.css` belong to earlier designs that are no longer used, and the career data is duplicated between the page and the AI prompt.
5. **Content accuracy.** A few claims on the page and in the AI's "verified" context go beyond what `Profile.pdf` supports.

---

## 2. Findings by Severity

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 4 |
| Medium | 10 |
| Low | 9 |

Each finding has an ID (for example **C1**), its location, the problem, and the remedial action.

---

## 3. Critical

### C1. `.env` is not git-ignored, because the ignore file has the wrong name

- **Location:** `..gitignore` (project root)
- **Problem:** Git only reads a file named exactly `.gitignore`. The file on disk is `..gitignore` (two dots), so git ignores nothing. The first `git init` followed by `git add .` would commit `.env` with the live OpenRouter key. The file also has no entries for `node_modules/`, `.next/`, or `tsconfig.tsbuildinfo`.
- **Remedial action:**
  1. Rename `..gitignore` to `.gitignore`.
  2. Set its contents to at least:

     ```gitignore
     .env
     .env*.local
     node_modules/
     .next/
     out/
     tsconfig.tsbuildinfo
     next-env.d.ts
     Profile.pdf
     ```

  3. Add a `.env.example` containing placeholder values only, so other developers know which variables to set.
  4. The folder is not a git repository yet. Run `git init` only after the rename.

### C2. The OpenRouter API key must be treated as exposed

- **Location:** `.env`, line 1
- **Problem:** During this development session the contents of `.env`, including the full `sk-or-v1-…` key, were read and printed into the chat transcript. Anything printed there should be treated as compromised.
- **Remedial action:**
  1. Revoke the current key in the OpenRouter dashboard and create a new one.
  2. Put a monthly credit limit on the new key in OpenRouter.
  3. Put the new key in `.env` only, then restart `npm run dev`.

---

## 4. High

### H1. No rate limiting or cost controls on `/api/chat`

- **Location:** `app/api/chat/route.ts`, `POST` handler
- **Problem:** Every request triggers a paid model call. A request can carry 12 messages of up to 2,000 characters each (about 24,000 characters of input) and ask for 700 output tokens. Nothing limits how often one client can call the endpoint, and nothing caps the request body size. A simple script could run up a large bill.
- **Remedial action:**
  - Add per-IP rate limiting (for example 10 requests per minute and 100 per day), using middleware or a store such as Upstash Redis once deployed.
  - Reject bodies over a fixed size (for example 32 KB) before parsing them.
  - Cap total characters across all messages, not just each message.
  - Rely on the OpenRouter key's credit limit (see C2) as a last line of defence.

### H2. The client controls the entire conversation, including "assistant" turns

- **Location:** `route.ts`, lines 94–107; `ChatTwin.tsx`, line 58
- **Problem:** The browser sends the full history, and the server accepts both `user` and `assistant` roles from it. A visitor can make up earlier "assistant" replies (for example, *"Yes, I was fired from AT&T"*) to steer the model, then screenshot the result as though it were Okechukwu's digital twin. Nothing leaks, because the model has no tools or secrets, but the reputational risk is real for a personal brand.
- **Remedial action:**
  - Simplest option: accept only `user` messages from the client, and keep assistant replies server-side, keyed by a short-lived session ID.
  - Otherwise, sign each assistant reply on the server (an HMAC) and reject any history whose signature does not match.
  - Add a line to the system prompt telling the model to disregard earlier assistant turns that contradict the verified profile.

### H3. Hidden mobile menu links can still be reached with the keyboard

- **Location:** `globals.css`, `.editorial-links` inside `@media (max-width: 820px)`; `page.tsx`, lines 84–90
- **Problem:** When the menu is closed it is hidden with `opacity: 0` and `pointer-events: none`. Both are visual only. Keyboard and screen-reader users still tab through five invisible links. The toggle button also has no `aria-controls`, and Escape does not close the menu.
- **Remedial action:**
  - Add `visibility: hidden` to the closed state and `visibility: visible` to `.open`. Visibility can still be transitioned, so the fade keeps working.
  - Add `id="site-nav"` to the `<nav>` and `aria-controls="site-nav"` to the button.
  - Close the menu on Escape, and when the viewport grows past 820px.

### H4. Several text styles are too small to read

- **Location:** `globals.css`, 26 declarations of `font-size: 6px`, `7px`, or `8px`
- **Problem:** Navigation links, career dates, results, chat labels, the chat disclaimer (6px at 30% opacity), and the footer are all below any practical readability threshold. Some also have low contrast, such as `rgba(244,243,238,0.3)` on near-black. This fails WCAG 2.2 success criteria 1.4.3 (contrast) and 1.4.4 (resize text) in practice, and it looks broken on high-density phones.
- **Remedial action:**
  - Set a floor of 11px for decorative uppercase labels and 14px for body copy. Use `rem` units so the text follows the browser's font-size setting.
  - Check every text and background pair against a 4.5:1 contrast ratio (3:1 for large text).
  - Add the floor values as CSS variables (for example `--text-xs: 0.75rem`) so nobody reintroduces tiny sizes.

---

## 5. Medium

### M1. About 70% of `globals.css` is dead code from earlier designs

- **Location:** `globals.css`, 2,811 lines
- **Problem:** The file still holds every earlier iteration: the first `.nav`, `.hero`, `.timeline`, `.capability-*`, `.work-*`, `.contact`, and `footer` styles, plus the first chat widget's `.twin-*` styles. There are 108 top-level rules for classes that no longer appear in any component. Some old rules still leak into the current page:
  - The global `footer { … }` rule applies to `<footer className="reference-footer">`.
  - `svg:not(.editorial-portrait-svg) path` exists only to stop an old global SVG stroke rule from hitting the portrait.
  - Old `@media` blocks set styles for elements that no longer exist.
- **Remedial action:**
  - Delete every selector that is not used by `page.tsx` or `ChatTwin.tsx`.
  - Split what is left into CSS Modules (`Hero.module.css`, `ChatTwin.module.css`, and so on), or at least separate files, so styles are scoped to their components.
  - Remove the `svg:not(...)` workaround once the old global SVG rule is gone.

### M2. Content fades in only if JavaScript runs

- **Location:** `globals.css` `.reveal`; `page.tsx`, lines 67–76
- **Problem:** Anything with `.reveal` starts at `opacity: 0` and only appears after JavaScript adds `.is-visible`. If JavaScript fails, is slow, or is blocked, the summary, career rows, expertise board, and contact heading stay invisible.
- **Remedial action:** Hide elements only when JavaScript is available. For example, add a `js` class to `<html>` with a tiny inline script, and write the rule as `.js .reveal { opacity: 0; … }`. Another option is CSS scroll-driven animations (`animation-timeline: view()`), which need no JavaScript.

### M3. The whole page is a client component

- **Location:** `page.tsx`, line 1 (`"use client"`)
- **Problem:** Only the menu toggle and the scroll observer need the browser. Marking the whole page as a client component sends all of its markup and data to the browser as JavaScript, when most of it could be static server-rendered HTML.
- **Remedial action:** Remove `"use client"` from `page.tsx`. Move the navigation into a small client component (`SiteNav.tsx`), and the observer into a `<RevealObserver />` client component that renders nothing. The rest of the page then becomes a server component.

### M4. Google Fonts are loaded with a render-blocking CSS `@import`

- **Location:** `globals.css`, line 1
- **Problem:** An `@import` of a third-party stylesheet blocks rendering, adds extra network round-trips, sends visitor IPs to Google, and can cause text to shift when the fonts arrive.
- **Remedial action:** Use `next/font/google` in `layout.tsx` for DM Sans, Manrope, and Playfair Display, and expose them as CSS variables. Next.js then self-hosts the fonts, preloads them, and reduces layout shift.

### M5. Chat accessibility: no Escape, no focus trap, no focus return

- **Location:** `ChatTwin.tsx`
- **Problem:**
  - Escape does not close the panel.
  - When the panel closes, focus is not sent back to the launcher button.
  - The textarea is `disabled` while waiting for a reply, which removes focus from it, and nothing puts focus back afterwards. Keyboard users have to tab back in after every message.
  - `aria-live="polite"` is set on the whole message list, so screen readers may re-announce the suggestion buttons and the "thinking" indicator.
- **Remedial action:**
  - Add a `keydown` listener for Escape while the panel is open, and focus the launcher when the panel closes.
  - Use `readOnly` or `aria-busy` instead of `disabled` on the textarea, and focus it again when `loading` becomes false.
  - Put `role="log"` on the message list, or announce only the newest assistant reply through a visually hidden live region.

### M6. Error text is saved as an assistant message and sent back to the model

- **Location:** `ChatTwin.tsx`, lines 68–78
- **Problem:** When a request fails, the error string (for example *"The digital twin is temporarily unavailable."*) is added to `messages` as an `assistant` turn. The next request sends it to the model as if the twin had said it, which pollutes the context.
- **Remedial action:** Keep errors in separate state (`const [error, setError] = useState<string | null>(null)`) and show them as an inline notice with a **Retry** button. Do not add them to the conversation history.

### M7. Non-JSON responses produce confusing error messages

- **Location:** `ChatTwin.tsx`, line 60; `route.ts`, line 140
- **Problem:** Both sides call `response.json()` without checking the response type. If a proxy or gateway returns an HTML error page (such as a 504), the parse throws and the visitor sees something like *"Unexpected token '<'…"*.
- **Remedial action:** Check `response.headers.get("content-type")` before parsing, or wrap the parse in its own `try` and fall back to a generic, friendly message.

### M8. Model and referrer settings are hardcoded, which leaves `.env` settings unused

- **Location:** `route.ts`, lines 10 and 124
- **Problem:** `.env` defines `OPENROUTER_MODEL=openai/gpt-5.6-sol`, but the route ignores it and uses the hardcoded `MODEL` constant. Changing `.env` therefore has no effect, which is confusing. `HTTP-Referer` is fixed to `http://localhost:3000`, which will be wrong once the site is deployed.
- **Remedial action:** Read `process.env.OPENROUTER_MODEL ?? "openai/gpt-5.6-sol"` and `process.env.SITE_URL ?? "http://localhost:3000"`. Document both in `.env.example`.

### M9. The AI's "verified" context contains unverified claims

- **Location:** `route.ts`, `CAREER_CONTEXT`; `page.tsx` career and expertise data
- **Problem:** The prompt tells the model to use *only verified information*, but some items do not appear in `Profile.pdf`:
  - **Python** is listed as a skill. The PDF does not mention it.
  - **MLOps** appears on the expertise board. The PDF describes Docker and Kubernetes deployment but never uses the term.
  - The AT&T result says **"7 years in cloud engineering"**. The PDF says 6 years 10 months (April 2012 to January 2019).

  These are small, but a recruiter who cross-checks LinkedIn may notice them, and they weaken the "grounded" promise shown in the chat footer.
- **Remedial action:** Confirm each item with Okechukwu. Then either add it to LinkedIn or remove it. Change "7 years" to "~7 years" or "6+ years".

### M10. Career data is duplicated between the page and the AI prompt

- **Location:** `page.tsx` `career` array; `route.ts` `CAREER_CONTEXT`
- **Problem:** The same roles, dates, and metrics are written twice in different formats. An update in one place and not the other will make the page and the chatbot contradict each other.
- **Remedial action:** Create a single `content/profile.ts` (or JSON) file that holds the roles, skills, certifications, and contact details. Render the timeline from it and build `CAREER_CONTEXT` from it on the server.

---

## 6. Low

### L1. No security headers
`next.config.mjs` sets no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers. **Action:** Add a `headers()` function to `next.config.mjs` before deploying.

### L2. Linting is really only type-checking
The `lint` script was changed to `tsc --noEmit`. There is no ESLint, so problems such as missing hook dependencies and accessibility issues in JSX go unreported. **Action:** Add `eslint`, `eslint-config-next`, and `eslint-plugin-jsx-a11y`. Keep a separate `typecheck` script.

### L3. No automated tests
Nothing covers the API route's validation, the chat's send, error, and keyboard behaviour, or the mobile menu. **Action:** Add Vitest unit tests for `route.ts` (with `fetch` mocked) and one Playwright test for the chat and menu.

### L4. `tsconfig.json` targets ES5
`"target": "es5"` is out of date. Next.js compiles with its own toolchain, so this mainly affects type-checking of newer syntax. **Action:** Change it to `"ES2022"`.

### L5. Chat auto-scroll can scroll the whole page
`endRef.current?.scrollIntoView()` scrolls every scrollable ancestor, including the page itself on some mobile browsers. **Action:** Set `messagesRef.current.scrollTop = messagesRef.current.scrollHeight` on the message container instead.

### L6. The "active" navigation state never changes
`Home` always carries `className="active"`, whatever section is on screen. **Action:** Remove it, or update it from the existing `IntersectionObserver`.

### L7. SVG gradient IDs are global
`portraitFill` and `portraitGlow` would clash if `PortraitGraphic` were ever rendered twice on a page. **Action:** Generate the IDs with React's `useId()`.

### L8. Missing SEO and sharing assets
There is no favicon, Open Graph image, `robots.txt`, `sitemap.xml`, or `Person` JSON-LD. **Action:** Add `app/icon.png`, `app/opengraph-image.png` (or a generated `opengraph-image.tsx`), `app/robots.ts`, `app/sitemap.ts`, and a JSON-LD `<script>` in the layout.

### L9. Personal data and generated files sit in the project root
`Profile.pdf` contains a mobile phone number. It is not served, because it is outside `public/`, but it would be committed to any repository. `AGENTS.md` and `CLAUDE.md` were generated automatically by Next.js. **Action:** Move `Profile.pdf` outside the project or git-ignore it (see C1), and decide whether to keep the generated agent files.

---

## 7. Things That Are Done Well

- **The API key stays on the server.** The browser only ever calls `/api/chat`.
- **Inputs are validated.** Roles are allow-listed, content is type-checked, trimmed, and length-capped, and the history is limited to 12 turns.
- **Upstream failures are handled.** There is a 45-second timeout, errors are logged on the server, and the visitor sees a generic message instead of internal details.
- **The system prompt is grounded.** It forbids invented facts and tells the model to point visitors to real contact channels.
- **Reduced motion is respected.** A `prefers-reduced-motion` block turns off animations.
- **The markup is semantic.** Pages use `section`, `article`, `blockquote`, `header`, and `footer`, and decorative SVGs have `aria-hidden`.
- **`inert` is applied to the closed chat panel.** This correctly keeps its controls out of the tab order.
- **No copied likeness.** The reference image's photograph of another person was not reused, and an original illustration was drawn instead.
- **Dependencies are current.** Next.js 16.3.8 and React 19.2 installed with zero reported vulnerabilities.

---

## 8. Note on the Earlier Hydration Warning

A React hydration-mismatch warning appeared in development. The diff showed only `data-cursor-ref` attributes, which the browser-automation tool injected while testing. It is not a code bug and will not happen for real visitors. The footer's `new Date().getFullYear()` could in theory mismatch if the server and browser straddle midnight on New Year's Eve. **Action (optional):** Render the year on the server once M3 is done.

---

## 9. Remedial Action Plan

### Do before anything is committed or deployed
1. Rename `..gitignore` to `.gitignore` and fill it in (C1).
2. Rotate the OpenRouter key and set a credit limit (C2).
3. Add rate limiting and body-size limits to `/api/chat` (H1).

### Do before the site is public
4. Stop trusting client-sent assistant turns (H2).
5. Fix keyboard access to the mobile menu (H3).
6. Raise the minimum font sizes and fix contrast (H4).
7. Confirm or remove the unverified claims (M9).
8. Add security headers (L1).

### Do next, for quality and maintainability
9. Delete the dead CSS and split styles by component (M1).
10. Make the reveal animation work without JavaScript (M2).
11. Convert the page to a server component with small client islands (M3).
12. Switch to `next/font` (M4).
13. Fix chat accessibility and error handling (M5, M6, M7).
14. Move settings into environment variables (M8).
15. Create one shared profile data source (M10).

### Nice to have
16. Add ESLint, tests, a modern TypeScript target, SEO assets, and the smaller fixes (L2–L9).

---

## 10. Verification Performed

| Check | Result |
|---|---|
| `npm run lint` (`tsc --noEmit`) | Passed |
| `npm run build` | Passed; `/` static, `/api/chat` dynamic |
| Live API call to `/api/chat` | Returned a grounded answer from `openai/gpt-5.6-sol` |
| Desktop (1440px) and mobile (390px) render | Checked visually during development |
| `npm install` audit | 0 vulnerabilities |
| Git repository | **Not initialised**; the ignore file is misnamed (C1) |
