# Metrics

## North Star Metric
**Credex consultation bookings per week**

Why: This is the single output that connects the free tool to Credex revenue. 
Everything else (visitors, audits, emails) is upstream of this. A tool that drives 
traffic but no consultations is worthless to Credex. A tool that drives consultations 
that don't close is a sales problem, not a product problem. This metric sits exactly 
at the handoff between the two.

Not "audits completed" — because audits with $0 savings don't drive revenue.
Not "DAU" — people use this tool once per quarter, not daily.
Not "email captures" — emails without follow-through don't count.

## 3 Input Metrics

1. **Audit completion rate** (visitors who complete the full form / total visitors)
   — If this drops below 20%, the form is too long or confusing. Target: 25-35%.

2. **High-savings audit rate** (audits showing >$500/mo savings / total audits)
   — Drives Credex CTA visibility. If this is too low, audit logic may be too conservative.

3. **Credex CTA click-through rate** (clicks on Credex CTA / audits showing >$500 savings)
   — Direct upstream driver of consultation bookings. Target: 15-25%.

## What to instrument first
1. Form submission event (which tools selected, use case, team size)
2. Results page load (audit ID, total savings bucket: $0 / $1-99 / $100-499 / $500+)
3. Credex CTA click (audit ID, total savings)
4. Email capture submission (audit ID, savings amount)
5. Share URL copy click (audit ID)

Use Vercel Analytics (free, zero config) for page views. Use a simple custom events 
table in Supabase for the above 5 events.

## Pivot trigger number
If after 500 audits completed, fewer than 10 result in a Credex consultation booking 
(2% conversion), the problem is either:
- Audit logic is too conservative — not surfacing real savings
- Credex CTA placement/copy is wrong
- Wrong audience is finding the tool

At that point: interview 10 users who saw high savings but didn't click Credex CTA. 
That conversation determines the pivot.