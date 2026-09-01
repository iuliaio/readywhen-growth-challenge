# Written Assessment — readywhen growth (Stage 3 companion)

Short-form answers: reasoning, numbers and thresholds over prose, per the sheet.

---

## Q1 — Activation metric

_One metric for first-session value (event, condition, window), the "If X in session 1, N× more likely to Y" hypothesis, and how to check it against existing data first._

- **Metric:** connects ≥1 source **and** approves or edits an auto-drafted commitment, within **24h of signup**.
- **Why this, not "reached the board":** board = saw a promise we surfaced; approved/edited draft = the product did the work owed and they trusted the output.
- **Hypothesis:** a user who does this in session 1 is **~2× more likely** to return and approve another draft in days 7–14. Below ~1.5× the metric is too weak to build on.
- **Check before building:** cohort from 6+ weeks ago, split by the 24h behaviour, compare the day 7–14 return-and-approve rate of each group — the ratio is N.
- **Sanity check:** 20–50% of the cohort is actually approving/editing drafts (rarer = unrepresentative; more common = not discriminating).
- **If draft events aren't logged yet:** add them, wait ~4 weeks for a cohort.

---

## Q2 — Is 45% connect a problem?

_Benchmark (source + trust), target after a quarter, "fixed" threshold._

- **Verdict:** not obviously bad — mid-range for a cold ask that wants sensitive access.
- **External benchmark:** found nothing I can confidently cite. I'd stick to internal metrics (what I can rely on)
- **Better anchor:** our own other connect points — a 2nd source mid-session, and the "connect more" section on the brain page. Same users, same trust context.
- **Real ceiling:** comes from the Q3 interviews — what share of non-connectors are a hard "no" vs "not yet".
- **Target after one quarter:** 45% → **60%**.
- **"Fixed" threshold:** above **~60%**, or the point where connect is no longer the biggest single leak — whichever comes first.

---

## Q3 — Why do 55% leave without connecting? (first two weeks)

_Analytics pulls, user research (how many, how recruited), what each gives you that the other can't._

- **Analytics (week 1):** break the connect step into sub-steps — saw the list / picked a source / hit the permission screen / finished or bailed — and locate the drop.
- Split by **connector type** (does email decline harder than calendar?), and check whether non-connectors **come back and connect later** (timing vs outright refusal).
- **Users:** auto-email people who reached connect and didn't finish, within 48h, with a calendar link for a short call. ~50–60 emails → **5–8 calls**
- **Technique:** don't ask "why didn't you connect" - ask "take me back to that screen, what were you thinking" (Mom test technique).
- **Also:** add "Other" option (or search bar) on the connect screen — maybe we just don't have the app listed
- **What each gives you:** analytics = _where_ the drop is and how big, per segment; interviews = _the reason_ and the user's own words; "other" option = _what are we missing_.

---

## Q4 — Rank A / B / C (1,000 signups/mo)

_Rank, show the arithmetic, users reaching the board per month for each, which you'd ship, what changes your mind._

Baseline: `1000 × 0.85 × 0.80 × 0.95 = 646` reach connect; `646 × 0.45 × 0.75 = 218` reach the board.
_Math operation taken directly from Claude_

| Option                         | Change              | Board/mo after                                   | Δ board/mo |
| ------------------------------ | ------------------- | ------------------------------------------------ | ---------- |
| **A** — rewrite connect screen | connect 45% → 55%   | `646 × 0.55 × 0.75 = 266`                        | **+48**    |
| **B** — fix board-load failure | board 75% → 90%     | `646 × 0.45 × 0.90 = 262`                        | **+44**    |
| **C** — cut name + survey      | that step 85% → 95% | reach-connect → `722`; `722 × 0.45 × 0.75 = 244` | **+26**    |

- Raw ranking is close (A ≈ B), so confidence decides it:
  - **A** — a redesign; lands its estimate maybe ~40% of the time → risk-adjusted **~+25–35**, and the most work.
  - **B** — a bug fix; ~90% likely to land → risk-adjusted **~+39–44**, and the least work.
  - **C** — medium confidence, and the extra 10pp let through may be lower-intent → risk-adjusted **~+16**.
- **Decision:** ship **B** this sprint, then **A**.
- **Changes my mind:**
  - A prototype (experiment?) or user signal validates A's 55% → A first.
  - The board "failure" is a UX drop-off, not a bug → A first.

---

## Q5 — Connectors in session 1 predicts return

**Confounder + check.**

- **Confounder:** motivation, not connector count. Motivated users connect more _and_ return more; the count isn't the cause.
- **Check:** among users who connected exactly 1 source, does speed-to-connect still predict retention? If it does, motivation is the real driver and "count" is mostly selection.

**Experiment to increase connectors per session.**

- **Focus (given ICP + product):** the ICP makes promises across email, calendar and meetings — one source misses most of them. So: **right after the first connection and the commitments reveal, prompt for a 2nd source** (e.g. email → calendar), with the reason tied to what was just found.
- **Hypothesis:** the ≥2-source rate rises; the ≥1-source rate stays flat.
- **Metric that settles it:** % of exposed users with **≥2 sources connected by end of session 1**.
- **Guardrail:** the ≥1-source rate must not drop (a second ask shouldn't scare people off the first).
- **Positive result:** multi-connect is a causal lever — roll it out, then test a 3rd-source prompt.
- **Negative result:** wrong timing (move the nudge to day 2 / contextual later), or it confirms the correlation was selection → drop "connector count" as a goal.
