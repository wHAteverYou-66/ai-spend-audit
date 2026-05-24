# Tests

All tests cover the audit engine (`lib/auditEngine.ts`).

## Test file
`tests/auditEngine.test.ts`

## How to run
```bash
npm test
```

## Test coverage

| Test | What it covers |
|------|---------------|
| Zero seats/spend returns no results | Edge case — tools not in use are ignored |
| Cursor solo user on Pro → Hobby | Downgrade logic for individuals |
| Cursor 2-person team on Pro → Hobby | Downgrade logic for small teams |
| Cursor Pro 5 seats → no change | Correctly avoids over-recommending |
| Claude Max → Pro for non-research | Plan right-sizing for common use cases |
| Claude Max kept for research | Use-case-aware logic |
| GitHub Copilot Enterprise → Individual for small team | Enterprise overkill detection |
| ChatGPT → Cursor for coding teams | Cross-tool alternative recommendation |
| Total savings calculated correctly | Aggregation across multiple tools |
| Billing discrepancy flagged | Overpayment vs expected plan price |