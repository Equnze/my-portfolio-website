# Building My AI Portfolio Website: A Beginner's Guide

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

## 1. What I Built

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
