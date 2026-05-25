# User Interviews

Five conversations conducted between 2026-05-24 and 2026-05-25 via WhatsApp chat 
and voice call. Names withheld or initials used at interviewees' request.

---

## Interview 1 — R.K., Senior Engineering Lead, 8-person product team (Series A)
*Conducted: 2026-05-24, ~15 minutes, WhatsApp call*

**Role and context:**
Leads a dev team of 6-10 engineers. Approves tooling spend. Uses Claude Code, 
Cursor, and ChatGPT Team. Estimated team-wide AI spend: $5,000–$8,000/month.

**Direct quotes:**
- "Claude Code was amazing at first — basically a 'take my money' product."
- "We crossed $70k/year on Claude Code before realizing how insane it got."
- "One engineer can accidentally generate hundreds in API costs in a week."

**Most surprising thing they said:**
The problem wasn't the subscription price at all — it was invisible API usage. 
Engineers running long-context coding sessions were burning thousands in token costs 
without anyone tracking it. They had no dashboard, no alerts, no cap. The $70k/year 
figure wasn't a decision — it crept up on them.

**What it changed about my design:**
I originally focused only on subscription plan optimization. This interview made 
clear that API usage monitoring is the bigger pain point for engineering teams. 
I added a note in the audit results for API direct users warning about token cost 
explosion from long context windows, and flagged it as a category the current tool 
doesn't fully solve — which is honest and credible.

---

## Interview 2 — S.M., Solo Product Designer, Freelance
*Conducted: 2026-05-24, ~10 minutes, WhatsApp chat*

**Role and context:**
Handles UI/UX and branding independently. Uses Midjourney, ChatGPT Plus, Notion AI, 
and Perplexity AI. Total personal AI spend: $120–$250/month.

**Direct quotes:**
- "It's never just one subscription anymore."
- "I realized I was spending almost one-fourth of my rent on AI tools."
- "Half these tools I only open 2–3 times a month, but I still keep them."

**Most surprising thing they said:**
They knew the tools overlapped heavily but kept paying anyway because each one was 
"slightly better" at one specific task. They weren't irrational — they had reasoned 
themselves into each subscription individually. The problem is nobody ever showed 
them the total number. Seeing "$220/month" written down was the shock, not any 
single tool's price.

**What it changed about my design:**
This confirmed that the hero number on the results page — total monthly spend and 
total savings — needs to be very large and impossible to miss. The per-tool breakdown 
matters less than the aggregate. I made the hero savings figure the biggest element 
on the results page as a direct result of this conversation.

---

## Interview 3 — A.P., Backend Developer, Solo / Vibe Coding Projects
*Conducted: 2026-05-25, ~12 minutes, WhatsApp chat*

**Role and context:**
Backend developer working on side projects and freelance work. Uses OpenAI API, 
Anthropic API, and Cursor. Monthly spend fluctuates from $300 to $1,000 depending 
on coding session intensity.

**Direct quotes:**
- "API pricing is pure consumption with no cap."
- "A long conversation can easily hit 50k tokens per request."
- "That's where the $1–3 per prompt comes from."

**Most surprising thing they said:**
He explained exactly how the cost explosion happens technically: long chats resend 
the entire conversation context on every message, so a 40-message thread is 
sending 40x the tokens of the first message. Most developers know this abstractly 
but don't feel it until the bill arrives. He had no idea his $300 month and $1,000 
month involved the same number of sessions — just different context lengths.

**What it changed about my design:**
Added an explicit warning in the audit results for anyone with API direct spend: 
"API costs scale with context length, not just usage frequency. Consider using 
shorter sessions or context-clearing tools." This is a specific, actionable insight 
that no generic audit tool would surface.

---

## Interview 4 — V.S., Startup Founder, ~20-person early-stage startup
*Conducted: 2026-05-25, ~14 minutes, WhatsApp call*

**Role and context:**
Founder managing a cross-functional team. Uses ChatGPT Enterprise, Claude Team, 
and GitHub Copilot. Estimated team-wide AI spend: $2,000–$10,000/month.

**Direct quotes:**
- "Every team had their own workspace."
- "We found duplicate ChatGPT subscriptions everywhere."
- "Nobody realized how much we were paying until finance checked the cards."

**Most surprising thing they said:**
Employees were independently buying AI tools on company cards without central 
approval — different teams had separate ChatGPT workspaces, separate Claude 
subscriptions, separate Notion AI plans. Finance discovered it during a quarterly 
review, not through any proactive monitoring. The founder estimated 30–40% of their 
AI spend was pure duplication.

**What it changed about my design:**
This is a use case I hadn't designed for — the audit needs to flag when a team is 
likely running duplicate subscriptions across tools with overlapping capabilities. 
I added a "duplication risk" check: if a user has both ChatGPT and Claude on paid 
plans with the same use case, the audit now flags it explicitly and suggests 
consolidating to one primary tool.

---

## Interview 5 — N.R., Marketing Team Employee, Mid-stage startup (~40 people)
*Conducted: 2026-05-25, ~10 minutes, WhatsApp chat*

**Role and context:**
Works on content and campaigns. Uses Jasper AI, ChatGPT Plus, and Canva Magic 
Studio. Combined personal + team AI spend: $80–$300/month per employee.

**Direct quotes:**
- "Everyone has their favorite AI tool, so the company ends up paying for all of them."
- "There's massive overlap between these products."
- "We're basically paying 4 tools to do the same thing."

**Most surprising thing they said:**
The company never made a decision to buy multiple AI writing tools — it happened 
because nobody wanted to tell their colleagues their preferred tool was wrong. 
Each person advocated for their own tool, and rather than conflict, the company 
just paid for all of them. The spend wasn't a purchasing failure, it was a 
communication failure.

**What it changed about my design:**
The shareable audit URL feature became more important after this conversation. 
If one person on a team runs the audit and shares the results URL with their 
manager, it creates a neutral third-party data point that removes the interpersonal 
friction of "you're using the wrong tool." I made the share button more prominent 
on the results page and added copy that says "share with your team or manager."