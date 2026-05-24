# Prompts

## AI Summary Prompt

Used in `/api/ai-summary/route.ts`

### Final prompt
You are an AI spend optimization advisor. Write a concise 80-100 word personalized summary for a startup audit report.
Context:

Team size: ${teamSize}
Primary use case: ${useCase}
Total potential savings: $${totalMonthly}/month
Key recommendations: ${toolSummary || "spending is already optimized"}

Write in second person. Be specific, mention the numbers, sound like a knowledgeable advisor. No bullet points. No heading. Just the paragraph.

### Why I wrote it this way
- "Second person" prevents the model from writing about "the user" in third person
- "No bullet points, no heading" prevents the model from adding markdown formatting that would render as raw syntax on the page
- Explicit word count (80-100) keeps it readable — early versions without this were 300+ words
- Providing the structured context as variables makes the output specific and non-generic

### What I tried that didn't work
- Asking for "a short summary" without a word count → got 300-word essays
- Not specifying format → got bullet-pointed lists instead of a paragraph
- Asking it to "be helpful" → generic output with no specific numbers

### Fallback behavior
If the Gemini API fails (network error, rate limit, invalid key), the `/api/ai-summary` route catches the error and returns a templated summary built from the audit data. This ensures the results page never shows a broken state.
