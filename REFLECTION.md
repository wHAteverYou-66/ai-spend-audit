# Reflection

## 1. The hardest bug I hit this week

The hardest bug was the Supabase Row Level Security (RLS) policy blocking all 
inserts from the app. When I submitted the form, the API route returned a 500 error 
and nothing was saved to the database. The error message was:
`new row violates row-level security policy for table "leads"`

My first hypothesis was that the Supabase environment variables were wrong — I 
checked .env.local and verified the URL and anon key were correct. That wasn't it.

My second hypothesis was that the insert query itself had a syntax error. I added 
console.log statements to the save-audit route and confirmed the data was reaching 
the route correctly. The query looked fine.

The third hypothesis was that the table structure didn't match — maybe a column 
name mismatch. I checked the Supabase table editor and the column names matched exactly.

Finally I searched the exact error message and understood that Supabase enables RLS 
by default on all tables, which blocks all operations unless explicit policies are 
defined. Since this is an internal tool with no user authentication, the fix was to 
disable RLS entirely via SQL: `alter table leads disable row level security`. 

What I learned: always check database-level permissions before assuming the 
application code is wrong. RLS is a security feature that silently blocks operations 
— it doesn't tell you "you're not authenticated," it just looks like a policy violation.

## 2. A decision I reversed mid-week

I initially planned to run the audit logic on the server side — send the form data 
to an API route, compute results there, then return them. My reasoning was that 
keeping pricing data server-side would prevent users from seeing or manipulating it.

I reversed this on Day 2 after realizing the pricing data is already public 
information — it's all on vendor websites. There's no reason to hide it. Running 
the audit entirely client-side in TypeScript meant:
- Instant results with no loading spinner
- No API call needed for the core calculation
- Easier to test with pure functions
- The audit engine became a clean, testable module with no side effects

The trigger was writing the first test — I realized a pure function that takes 
inputs and returns results is far easier to test than a server route. The 
architecture became simpler and more correct by moving the logic to the client.

## 3. What I would build in week 2

First priority: **API usage monitoring**. The biggest insight from user interviews 
was that subscription prices are not the main pain point for engineering teams — 
invisible API token costs are. A week 2 feature would let users paste their 
OpenAI or Anthropic API usage data and get a breakdown of which projects, which 
models, and which team members are driving costs.

Second: **team comparison benchmarks**. "Your team spends $X per developer per 
month — companies your size average $Y." This requires collecting enough audit 
data to compute real benchmarks, which by week 2 we'd be starting to have.

Third: **Slack or email alerts**. Instead of a one-time audit, let users connect 
their billing emails and get a monthly alert when their AI spend crosses a threshold. 
This turns a one-session tool into a recurring-value product.

## 4. How I used AI tools

**Tools used:** Claude (primary), ChatGPT (secondary), Gemini API (in the product itself)

**What I used them for:**
- Claude: generating boilerplate Next.js code, debugging error messages, writing 
  TypeScript types, explaining what RLS was and how to fix it
- ChatGPT: cross-checking explanations when Claude's answer seemed off
- Gemini API: the AI summary feature inside the product

**What I didn't trust AI with:**
- The audit engine logic — I wrote the recommendation rules myself because they 
  need to be defensible to a finance person. AI-generated rules tended to be 
  too generic ("consider cheaper alternatives") without specific numbers.
- The user interview write-ups — these had to reflect real conversations
- REFLECTION.md and ECONOMICS.md — judgment calls that needed to be mine

**One specific time the AI was wrong:**
Claude initially suggested using `params.id` directly in the Next.js dynamic route 
page. This caused a runtime error because in Next.js 15, params is a Promise and 
must be awaited before accessing properties. Claude's training data predated this 
Next.js 15 change, so it gave confidently wrong advice. I caught it because the 
error message was explicit, searched the Next.js docs, and found the correct pattern: 
`const { id } = await params`.

## 5. Self-ratings

| Dimension | Rating | Reason |
|-----------|--------|--------|
| Discipline | 7/10 | Committed every day and started on Day 1, but some days were rushed in the evening rather than spread through the day |
| Code quality | 6/10 | Code works and is readable, but I'd refactor the audit engine rules into a data-driven config rather than if/else chains given more time |
| Design sense | 7/10 | Results page is clean and scannable. Would invest more in micro-interactions and mobile layout with more time |
| Problem-solving | 8/10 | Debugged RLS, Next.js params, and JSX encoding issues methodically by forming hypotheses rather than random changes |
| Entrepreneurial thinking | 7/10 | User interviews surfaced real insights that changed the product. Economics math is grounded in real numbers. Would want more time on distribution |