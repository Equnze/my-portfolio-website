# Building Okechukwu's AI Portfolio: A Beginner's Guide

This tutorial explains how the portfolio website in this project works. It is
written for someone who is completely new to front-end development.

By the end, you should understand:

- What technologies the website uses
- How a Next.js project is organized
- How the page structure and visual design are created
- How responsive layouts and animations work
- How the AI digital twin communicates with OpenRouter
- How to run, test, and safely modify the project

---

## 1. What We Built

The finished project is a professional portfolio website for Okechukwu Ikwunze,
an Applied AI/ML Engineer.

The site includes:

- A responsive navigation bar
- A split-screen hero section
- An original SVG portrait graphic
- An introduction and engineering philosophy
- A career timeline
- An expertise section
- Contact links
- Scroll-triggered animations
- A responsive AI digital twin chat widget
- A secure server endpoint that connects to OpenRouter

The design was inspired by the supplied reference image. It uses a dark
navigation bar, editorial typography, a large visual hero, handwritten-style
headlines, teal accent colors, and compact uppercase navigation.

The reference image contained a photograph of another person, so that photograph
was not copied into the portfolio. Instead, the site uses an original abstract
SVG illustration. This avoids presenting somebody else's identity as
Okechukwu's.

---

## 2. Technology Summary

### Next.js

Next.js is a framework built on top of React. React helps developers create
interfaces from reusable components. Next.js adds useful features such as:

- Routing
- Server-side code
- Production optimization
- Metadata management
- API endpoints
- Fast development tools

This project uses the **App Router**, the modern Next.js routing system.

### React

React builds the interface from components. A component is a JavaScript or
TypeScript function that returns markup.

For example:

```tsx
function Greeting() {
  return <h1>Hello!</h1>;
}
```

The browser ultimately displays HTML, but React makes the interface easier to
organize and update.

### TypeScript

TypeScript is JavaScript with type checking. It helps catch mistakes before the
code reaches the browser.

This type describes one chat message:

```tsx
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

The `role` can only be `"user"` or `"assistant"`, and `content` must be text.

### CSS

CSS controls the visual presentation of the site, including:

- Colors
- Typography
- Spacing
- Layout
- Responsive behavior
- Hover states
- Animations

The project uses plain CSS instead of a component framework. This gives the
design complete visual control.

### SVG

SVG stands for Scalable Vector Graphics. Unlike a normal photograph, an SVG is
made from shapes and paths. It remains sharp at every screen size.

The large hero illustration is an inline SVG React component.

### OpenRouter

OpenRouter provides one API that can access multiple AI models. The digital
twin uses this model:

```text
openai/gpt-5.6-sol
```

The browser never receives the private OpenRouter API key. The Next.js server
reads the key and makes the external request securely.

---

## 3. Project Structure

The important files are:

```text
SITE/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── components/
│   │   └── ChatTwin.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env
├── next.config.mjs
├── package.json
├── Profile.pdf
├── tsconfig.json
└── tutorial.md
```

### What each file does

- `app/page.tsx` builds the main portfolio page.
- `app/components/ChatTwin.tsx` builds and controls the chat interface.
- `app/api/chat/route.ts` securely sends chat requests to OpenRouter.
- `app/globals.css` contains the site's styling, layouts, and animations.
- `app/layout.tsx` defines shared page metadata and the HTML shell.
- `.env` stores private environment variables.
- `package.json` lists dependencies and project commands.
- `tsconfig.json` configures TypeScript.

---

## 4. How a Request Moves Through the Application

When somebody opens `http://localhost:3000`, the following happens:

```text
Browser
   ↓
Next.js page route
   ↓
app/layout.tsx
   ↓
app/page.tsx
   ↓
CSS + React components
   ↓
Rendered portfolio
```

When somebody sends a chat message:

```text
Chat form in the browser
   ↓
POST /api/chat
   ↓
app/api/chat/route.ts
   ↓
OpenRouter API
   ↓
AI model response
   ↓
Chat window in the browser
```

This separation is important. The interface runs in the browser, while the
private API key stays on the server.

---

## 5. The Root Layout

The root layout is in `app/layout.tsx`. Every page is rendered inside it.

The metadata provides the browser title, search description, keywords, and
social-sharing information:

```tsx
export const metadata: Metadata = {
  title: "Okechukwu Ikwunze — Applied AI/ML Engineer",
  description:
    "Applied AI/ML Engineer building intelligent, scalable systems across models, cloud, and enterprise infrastructure.",
};
```

The layout imports the global stylesheet:

```tsx
import "./globals.css";
```

It then places the current page inside the HTML body:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`children` means "whatever page should appear here."

---

## 6. Reviewing the Main Page

The main page is in `app/page.tsx`.

### Why it begins with `"use client"`

```tsx
"use client";
```

Next.js components are server components by default. This page needs browser
features such as state, click handlers, and `IntersectionObserver`, so it is
marked as a client component.

### Storing repeated career data

Career entries are kept in an array:

```tsx
const career = [
  {
    years: "2023 — PRESENT",
    company: "DIGITALMART",
    role: "AI / ML Engineer",
    text: "Building production AI pipelines...",
    result: "30% task-efficiency improvement",
  },
  // More roles...
];
```

This is cleaner than manually writing the same markup three times. React can
loop through the array with `map`:

```tsx
{career.map((item, index) => (
  <article key={item.company}>
    <span>0{index + 1}</span>
    <p>{item.years}</p>
    <h3>{item.role}</h3>
    <p>{item.text}</p>
  </article>
))}
```

The braces `{}` allow JavaScript to be used inside JSX.

### Building the SVG portrait

The portrait is a reusable component:

```tsx
function PortraitGraphic() {
  return (
    <svg viewBox="0 0 620 650" aria-hidden="true">
      <circle cx="302" cy="210" r="122" />
      <path d="M115 650c13-177..." />
      {/* Additional shapes */}
    </svg>
  );
}
```

Important SVG elements include:

- `<circle>` for circular shapes
- `<path>` for custom shapes and lines
- `<linearGradient>` for blended colors
- `<text>` for the "OI" initials

`viewBox` defines the SVG's internal coordinate system. CSS can resize the
entire image without making it blurry.

`aria-hidden="true"` tells screen readers that the illustration is decorative.

### Mobile navigation state

React state records whether the mobile menu is open:

```tsx
const [menuOpen, setMenuOpen] = useState(false);
```

The button reverses the value when clicked:

```tsx
onClick={() => setMenuOpen((value) => !value)}
```

The menu receives an additional `open` class when its state is true:

```tsx
<nav className={menuOpen ? "editorial-links open" : "editorial-links"}>
```

CSS uses that class to reveal or hide the menu.

### Scroll reveal animation

The page uses `IntersectionObserver` to detect when elements enter the screen:

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }),
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));

  return () => observer.disconnect();
}, []);
```

The empty dependency array `[]` means this setup runs once when the page loads.

The matching CSS begins with the element slightly lower and transparent:

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Page sections

The page is divided into semantic sections:

```tsx
<section id="home">...</section>
<section id="about">...</section>
<section id="journey">...</section>
<section id="expertise">...</section>
<section id="contact">...</section>
```

Navigation links use these IDs:

```tsx
<a href="#journey">Career</a>
```

Clicking the link scrolls to the element with `id="journey"`.

---

## 7. Reviewing the CSS Design

The site's styles are in `app/globals.css`.

### CSS variables

Variables keep important colors consistent:

```css
.editorial-site {
  --editorial-ink: #202226;
  --editorial-paper: #fbfbfa;
  --editorial-teal: #18b9b3;
  --editorial-teal-dark: #0b7774;
}
```

They are used later with `var()`:

```css
.brush-button {
  background: var(--editorial-teal);
}
```

Changing the variable updates every place that uses it.

### The split hero layout

CSS Grid creates the two-column hero:

```css
.reference-hero {
  display: grid;
  grid-template-columns: minmax(420px, 1.08fr) minmax(440px, 0.92fr);
  min-height: 570px;
}
```

- The first column contains the portrait.
- The second contains the headline and button.
- `fr` means a fraction of the available width.
- `minmax()` prevents a column from becoming too narrow.

### The brush-style button

The button's rough shape is made with `clip-path`:

```css
.brush-button {
  background: var(--editorial-teal);
  clip-path: polygon(2% 13%, 97% 1%, 100% 88%, 6% 100%);
  transform: rotate(-1.5deg);
}
```

The four polygon points create irregular edges, making the button look more
handmade.

### Responsive design

A media query applies different styles on narrower screens:

```css
@media (max-width: 820px) {
  .reference-hero {
    grid-template-columns: 1fr;
  }
}
```

Instead of two columns, mobile and tablet devices show the portrait and text
one above the other.

Another media query handles smaller phones:

```css
@media (max-width: 560px) {
  .expertise-board {
    grid-template-columns: 1fr;
  }
}
```

### Respecting reduced-motion preferences

Some visitors experience discomfort from animations. The stylesheet respects
their operating-system preference:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is an important accessibility feature.

---

## 8. Reviewing the AI Chat Component

The interface is in `app/components/ChatTwin.tsx`.

### Chat state

The component stores:

```tsx
const [open, setOpen] = useState(false);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState<Message[]>([
  {
    role: "assistant",
    content: "Hi, I’m Okechukwu’s AI digital twin...",
  },
]);
```

- `open` controls whether the panel is visible.
- `input` contains the current text box value.
- `loading` shows whether the AI is responding.
- `messages` contains the conversation.

### Sending a message

The component sends a POST request to the local API route:

```tsx
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});
```

`JSON.stringify()` turns the JavaScript object into JSON text.

When the server returns a reply, it is added to the conversation:

```tsx
setMessages((current) => [
  ...current,
  { role: "assistant", content: data.reply },
]);
```

The spread operator `...current` keeps the existing messages before adding the
new one.

### Handling errors

The request is wrapped in `try`, `catch`, and `finally`:

```tsx
try {
  // Send request and save response
} catch (error) {
  // Show a friendly error message
} finally {
  setLoading(false);
}
```

`finally` runs whether the request succeeds or fails.

### Keyboard support

Pressing Enter sends a message. Shift+Enter can still create a new line:

```tsx
if (event.key === "Enter" && !event.shiftKey) {
  event.preventDefault();
  void sendMessage(input);
}
```

### Modern visual effects

The chat window includes:

- A dark floating panel
- A rotating animated orb
- An ambient aurora gradient
- Animated status and typing dots
- Suggested questions
- Animated message entry
- A responsive full-height mobile layout

These effects are CSS animations, so they do not require another animation
library.

---

## 9. Reviewing the OpenRouter API Route

The server endpoint is `app/api/chat/route.ts`.

### Reading the secret API key

```tsx
const apiKey = process.env.OPENROUTER_API_KEY;
```

Environment variables are read on the server. The key must never be placed in
`page.tsx`, `ChatTwin.tsx`, or any variable beginning with `NEXT_PUBLIC_`.

### Validating messages

The route checks each message before forwarding it:

```tsx
body.messages
  .filter(
    (message) =>
      (message?.role === "user" || message?.role === "assistant") &&
      typeof message.content === "string"
  )
  .slice(-12);
```

This:

- Rejects invalid roles
- Rejects non-text content
- Keeps only the latest 12 messages
- Prevents the request from growing forever

### The system prompt

The API route contains verified profile information and instructions for the
AI. The prompt tells it:

- Speak as Okechukwu's AI representative
- Use only verified career information
- Do not invent experience or credentials
- Be transparent when asked whether it is AI
- Suggest direct contact when information is unavailable

This technique is called **grounding**. It reduces unsupported answers.

### Calling OpenRouter

The server sends the request:

```tsx
const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.6-sol",
      messages: [
        { role: "system", content: CAREER_CONTEXT },
        ...messages,
      ],
      temperature: 0.35,
      max_tokens: 700,
    }),
  }
);
```

Important options:

- `model` selects the AI model.
- `messages` sends instructions and conversation history.
- `temperature` controls variation. A lower number encourages consistent,
  factual answers.
- `max_tokens` limits response length and cost.

### Returning the reply

The response is sent back to the browser as JSON:

```tsx
return NextResponse.json({ reply: reply.trim() });
```

The API key is never included in this response.

---

## 10. Environment Variables and Security

The `.env` file contains configuration such as:

```env
OPENROUTER_API_KEY=replace-with-your-private-key
OPENROUTER_MODEL=openai/gpt-5.6-sol
OPENROUTER_URL=https://openrouter.ai/api/v1
```

Never paste the real API key into:

- A tutorial
- Client-side code
- Screenshots
- Git commits
- Public repositories

The `.env` file should be listed in `.gitignore`.

If a key is accidentally exposed, revoke it through OpenRouter and create a new
one immediately.

---

## 11. Running the Project

Open a terminal in the project directory.

### Install dependencies

```bash
npm install
```

This reads `package.json` and installs Next.js, React, TypeScript, and their
supporting packages.

### Start development mode

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Development mode automatically refreshes the browser after most code changes.

### Type-check the project

```bash
npm run lint
```

In this project, the lint command runs TypeScript without creating output files.
It reports type errors.

### Create a production build

```bash
npm run build
```

This checks the application and creates an optimized production version.

### Run the production build

```bash
npm start
```

Run `npm run build` before `npm start`.

---

## 12. Beginner-Friendly Customizations

### Change career information

Open `app/page.tsx` and edit the `career` array:

```tsx
{
  years: "2026 — PRESENT",
  company: "NEW COMPANY",
  role: "New Role",
  text: "Describe the work here.",
  result: "Add a measurable result",
}
```

### Change the accent color

Find this variable in `app/globals.css`:

```css
--editorial-teal: #18b9b3;
```

Replace the hex color. For example:

```css
--editorial-teal: #ff4fa3;
```

### Change the main headline

In `app/page.tsx`, locate:

```tsx
<h1>
  I BUILD THE
  <br />
  INTELLIGENCE.
</h1>
```

Replace the text while keeping the tags.

### Add another suggested AI question

In `app/components/ChatTwin.tsx`, add text to the array:

```tsx
const prompts = [
  "What is your AI experience?",
  "Why are you a strong technical hire?",
  "Tell me about your cloud background.",
  "What results have you delivered?",
];
```

### Update the AI's knowledge

Edit `CAREER_CONTEXT` in `app/api/chat/route.ts`. Only add information that is
accurate and approved for public use.

---

## 13. Common Problems

### Port 3000 is already in use

Another development server may already be running. Open the existing site at
`http://localhost:3000`, or stop the old process before starting another one.

### The chat says it is unavailable

Check:

1. `.env` contains `OPENROUTER_API_KEY`.
2. The key is valid and has sufficient credits.
3. The OpenRouter model name is correct.
4. The development server was restarted after changing `.env`.
5. Your internet connection can reach OpenRouter.

### CSS changes do not appear

Try:

1. Save the file.
2. Refresh the browser.
3. Restart `npm run dev`.
4. Confirm that `app/layout.tsx` imports `globals.css`.

### The mobile menu does not open

Confirm that `page.tsx` still includes `"use client"` and that the button's
`onClick` handler still changes `menuOpen`.

### A production build fails while development mode is running

Stop the development server, run `npm run build`, and then restart development
mode. This prevents two Next.js processes from modifying the same `.next`
folder.

---

## 14. Five Improvements From a Self-Review

### 1. Split the main page into smaller components

`app/page.tsx` currently contains the navigation, hero, career section,
expertise section, contact section, and SVG illustration. These could become
separate components:

```text
components/
├── Navigation.tsx
├── Hero.tsx
├── CareerJourney.tsx
├── Expertise.tsx
├── Contact.tsx
└── PortraitGraphic.tsx
```

This would make each file easier to read, test, and reuse.

### 2. Remove superseded CSS

The stylesheet contains styles from earlier visual versions of the site.
Although unused selectors do not change the current design, they increase file
size and make maintenance harder. A cleanup should remove unused rules and
divide the remaining CSS into focused files.

### 3. Stream AI responses

The chat currently waits for the complete OpenRouter answer before displaying
it. Streaming would display text as it is generated, making the assistant feel
faster and more conversational.

This would require:

- Enabling streaming in the OpenRouter request
- Returning a readable stream from the API route
- Reading incremental chunks in `ChatTwin.tsx`

### 4. Add rate limiting and automated tests

The public API route should be protected against excessive requests. A
production version could limit requests by IP address or session.

Tests should also cover:

- Invalid chat payloads
- Missing API configuration
- OpenRouter failures
- Mobile navigation
- Message submission
- Keyboard controls

### 5. Move portfolio data into a content file or CMS

Career data and AI context are currently written directly in source files.
Moving them into a structured JSON, Markdown, or content-management system
would allow updates without editing component code.

One shared data source could power both:

- The visible career timeline
- The digital twin's verified career context

This would reduce duplication and prevent the page and AI knowledge from
becoming inconsistent.

---

## Conclusion

This portfolio combines a React interface, responsive CSS, inline SVG artwork,
and a secure server-side AI integration.

The most important architectural lesson is the separation between browser code
and server code:

- React components create the visible experience.
- CSS creates the layout and visual identity.
- The Next.js API route protects secrets and contacts OpenRouter.
- Environment variables hold private configuration.

Start by changing text and colors. Then experiment with individual components.
Make one small change at a time, save the file, and review the result in the
browser. That feedback loop is the foundation of front-end development.
