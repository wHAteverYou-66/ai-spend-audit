## Day 1 — 2025-05-21

**Hours worked:** 3

**What I did:** Set up Next.js project with TypeScript and Tailwind. Initialized shadcn/ui. Connected GitHub repo and deployed to Vercel. Set up Supabase database with leads table. Created all required markdown files.

**What I learned:** How Next.js project structure works. How Vercel auto-deploys from GitHub. How to resolve Git detached HEAD states and remote branch conflicts using rebase. 

**Blockers / what I'm stuck on:** Initially got stuck on several Git push rejections due to remote conflicts and a detached HEAD state, which led to a `package.json` merge conflict. I also hit an unexpected paywall/verification block when trying to generate the Anthropic API key, but I unblocked myself by pivoting to the Gemini API instead.

**Plan for tomorrow:** Build the spend input form with all 8 AI tools.


## Day 2 — 2026-05-22

**Hours worked:** 4

**What I did:** Built the spend input form with all 6 AI tools. Created audit engine with recommendation logic in TypeScript. Created Supabase API route to save audits. Form state persists across page reloads via localStorage.

**What I learned:** How React state works with useState and useEffect. How Next.js API routes work. How to trace Next.js build errors and handle expected 404 redirects for missing dynamic pages.

**Blockers / what I'm stuck on:** Hit a syntax error in `layout.tsx` that temporarily broke the build. After fixing that, I encountered a 404 error upon form submission because it tries to redirect to `/audit/[id]`, which isn't built yet.

**Plan for tomorrow:** Tomorrow I build the results page — the page that shows the audit breakdown, total savings, and the shareable URL. That's the most visual part of the whole project.