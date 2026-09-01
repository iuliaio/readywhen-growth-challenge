# Task 2 — Improving the funnel

## Reading the data

`data/funnel.md` shows how many people get through each step of onboarding. Each number is
the share of the people who reached the _previous_ step — so "Picks their tools — 80%" means
80% of the people who finished the step before it went on to pick their tools.

That format makes it hard to see where the real losses are, because a 20% drop late in the
funnel affects far fewer people than a 20% drop early on. So I put every step on the same
basis: **out of every 100 people who sign up, how many are still in the funnel at this
point.**

| Step                           | Still here (per 100 sign-ups) | Lost getting here              |
| ------------------------------ | ----------------------------- | ------------------------------ |
| Reaches the welcome flow       | 100                           | —                              |
| Finishes name + survey         | 85                            | 15                             |
| Picks their tools              | 68                            | 17                             |
| Picks what's slowing them down | 65                            | 3                              |
| **Connects a source** ★        | **19**                        | **45**                         |
| **Lands on the board** ★       | **15**                        | **5**                          |
| Gets a 2nd Brain               | 5                             | 9 _(out of scope — see below)_ |

(★ marks the two steps that define the North Star: connected a source **and** reached the
board. The 19 and 15 line up with the README's own "20% connect a source, 15% reach the
board".)

Two things stand out:

- **The connect step is the problem.** 45 of every 100 sign-ups are lost between picking a
  blocker and connecting a source. That is more than every other step in the funnel added
  together.
- **The tools step is quietly expensive too.** "80%" sounds mild, but because it happens
  while a lot of people are still in the funnel, it loses 17 per 100 — more than the next
  two steps combined.

---

## Change 1 — ask people to connect a source _during_ the welcome flow, not after it

**The step this targets:** picking a blocker → connecting a source. Today only 30% of the
people who reach this point connect anything (that figure is straight from `data/funnel.md`,
the "Connects a source" row), and it costs 45 of every 100 sign-ups.

**What it was.** The fourth welcome screen was a checkbox list — "tick the tools you use".
Those answers were saved (`session.tools`) but never read anywhere else in the app. Then the
welcome flow ended, the page loaded the chat, the assistant typed for a moment, and only
_then_ asked the user to actually connect something.

**What it is now.** That fourth screen asks one question — "Where do most of your
commitments come from?" — and shows the four connectable sources directly, with the real
"allow access" step built in. There is a quiet "Skip for now" so it isn't a hard gate. The
chat keeps its own connect card as a fallback for people who skipped, hidden for anyone who
already connected. The order of the steps is unchanged, so the question stays generic rather
than tailored to the blocker the person picked.

**Why I expect it to help.** It removes a page change and the assistant's short delay
between "I picked a blocker" and "connect something", and it puts the ask on a screen people
already finish about 95% of the time.

**What I expect.** The connect rate goes from 30% to somewhere around 45–55%, recovering
maybe 20–25 of the 45 lost per 100. This is a hypothesis, not a promise — a change this
structural could also do nothing.

**How we will know, a few weeks after launch:**

- **It worked** if at least 45% of the people who reach this step connect a source, and if
  connections tagged as happening in the welcome flow clearly outnumber the old baseline of
  connections happening in the chat.
- **It didn't** if the connect rate stays below about 35% after a few hundred sign-ups.
- **Watch out for** people abandoning the welcome flow itself. If completion of that fourth
  screen drops (compare how many people see it against how many finish it), we could be
  trading a connect-step gain for a welcome-flow loss.
- **Also watch** whether people who connect here still go on to reach the board. If that
  rate falls, the earlier ask is producing weaker, lower-intent connections.

**Commit:** _"move source connection into the tools step at /welcome (blocker → connect,
expect +20–25 per 100 sign-ups)"_

---

## Change 2 — make the "you're unlocked" moment a visible button

**The step this targets:** connecting a source → landing on the board. 75% of the people who
connect reach the board today; this step loses about 5 per 100 sign-ups.

**What it was.** The first time someone connected, the assistant posted a plain paragraph
saying the board and 2nd Brain were now open in the sidebar, and the sidebar links quietly
switched on. Easy to miss.

**What it is now.** That paragraph is a card in the chat with a "View your board" button
that goes straight to the board. It is still a choice the user makes, not a forced redirect,
so it doesn't pull them away while they are reading the commitments the assistant just
found.

**Why I expect it to help.** The reason people don't reach the board isn't that they don't
want to — it's that they don't notice the sidebar changed. A button they can see fixes that
directly.

**What I expect.** The connect → board rate goes from 75% to around 90–95%, recovering 3–4
per 100. I am more confident here than in Change 1, because the cause is well understood and
the change is small.

**How we will know it didn't work:** if the connect → board rate doesn't climb toward 90%
within a few hundred connections. That would mean people are choosing not to go, rather than
failing to notice — and the next step would be a stronger nudge, not more visibility.

**Commit:** _"replace silent unlock with a board CTA card in chat (connect → board, expect
+3–4 per 100 sign-ups)"_
