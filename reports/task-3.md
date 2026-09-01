# Task 3 — Experiment: `flow-shape` (chat-first onboarding)

## What I believe

Onboarding shouldn't be a form you finish before the product starts — it should be the
product. Our users are owners of small service businesses, and they already know how to type
a problem into a chat box, because that is how they use ChatGPT or Claude for example. The
five welcome screens are a tax we charge before showing any value, and the connect ask — the
step that loses 45 of every 100 sign-ups — currently lands _after_ all of it, when momentum
is at its lowest.

`chat-first` flips the order. Sign up, land straight in the chat, and type what you need
done. The connect ask then arrives as the obvious next step to _act_ on what you just said:
"To actually chase this down I need to see where your work happens." The bet is that an ask
framed as "so I can do the thing you just asked for" converts far better than the same ask
delivered cold at the end of a form.

## The two arms

- **control** — the funnel exactly as Task 2 left it. Sign up → five welcome steps (with the
  connect ask folded into step 4) → chat.
- **chat-first** — sign up → straight to `/chat`. No welcome steps. A generic opener invites
  the user to type. Their **first message** triggers the connect card, in place of control's
  timed card. Later messages get the normal reply.

Switch arms with `/signup?flow-shape=chat-first`. `traffic` in the experiment definition is
set to `0.5` — that is the split I would ship at (see below).

The variant is resolved from the URL at the moment of sign-up and saved onto the session,
not read through the `useVariant` hook. It decides which page the user lands on, so it can't
tolerate the hook's one-render flash to "control" before the URL is read. Exposure
(`experiment.flow_shape_exposed`) is recorded at sign-up, not on landing on `/signup`,
because the arms only diverge after sign-up — someone who bounces off the sign-up page never
experiences either one.

## The metric that settles it

**North Star rate per arm** — of the people exposed to an arm, the share that both connect a
source and reach the board. Same definition as Task 2. Computed as `board.viewed` count ÷
`experiment.flow_shape_exposed` count, split by the `variant` tag now carried on every
`connector.*` event, `chat.message_sent`, and `board.viewed`.

**Win threshold: chat-first's North Star rate is at least 30% higher than control's,
relative.** If control lands at 30 per 100, chat-first needs ≥ 39 per 100.

Why the bar is that high:

1. This is a structural change with ongoing cost to maintain. It is only worth keeping if
   the gain is clear, not marginal.
2. At our volume we cannot detect a small effect in a sensible timeframe anyway (see
   "Running order and how long"), so the bar has to sit where the test can actually see it.
3. This bet is about as likely to fail badly as to win big. A decisive result in _either_
   direction is the point.

## Guardrails — making sure a win is real

- **Connect rate per arm** (`connector.connected` ÷ exposed, by variant). This is the
  mechanism the whole bet rests on. If the North Star rate is up but the connect rate isn't,
  the lift is coming from somewhere else and shouldn't be trusted.
- **Messages sent before connecting** (`chat.message_sent` with `firstConnector: "none"`, by
  variant). A lot of these in chat-first _together with_ a low connect rate means the
  escape-valve risk has materialised: people are using the chat happily and never
  connecting. That is the specific failure this design courts.

## Traffic split

**50/50.** The change is reversible and the worst case for an individual user is "had to
type one message before being asked to connect." There is no reason to ramp cautiously, and
an even split gives the fastest read in either direction.

## Running order and how long

Ship Task 2 on its own first and let it settle — a few weeks, until its North Star rate
(read off the Task 1 events) stops moving. That number is the control baseline, and it sets
how long this experiment needs.

- ~250 sign-ups a week; a 50/50 split is ~125 per arm per week. Four weeks ≈ 500 per arm.
- A test can only trust a gap between the two arms if it is clearly bigger than normal
  week-to-week noise. At ~500 per arm that noise is large enough that only a fairly big gap
  is trustworthy.
- **If the settled baseline is around 30 out of 100 sign-ups**, four weeks is enough to see
  a 30% improvement clearly.

Either way: if chat-first is not clearly ahead by the end of the planned window, revert. A
small lead is probably noise, and a structural change is not worth keeping on a maybe.

## If it loses

It is diagnostic either way:

- **Low connect rate in chat-first** → people need trust or context _before_ the ask. That
  is evidence for keeping some kind of pre-chat screen — though possibly a much shorter one,
  not the full five.
- **Connect rate fine, but connect → board drops** → the chat needs a stronger push after
  connecting. That is a small fix (a more prominent version of Task 2's board CTA), not a
  reason to abandon chat-first.

## Deliberate trade-offs (not oversights)

- **No firmographic survey** (headcount, role, department, referral) for the chat-first
  cohort during the test. Bundling a survey into the same interruption as the connect ask
  would confound the result — a drop could be the survey's fault, the ask's, or both, with
  no way to separate them. If chat-first wins, these questions fold into `/brain`'s existing
  context form later, not the critical path.
- **No organisation name collected** — same category, lowest stakes.
- **No real personalisation from the user's first message.** It is a richer signal than the
  old five-option blocker pick, but there is no model behind the chat ("canned answers… a
  demo, not a model"), so the opener stays generic regardless of what they type. An
  observation, not a claimed advantage.
- **The first message doesn't get a real answer** — it gets an acknowledgement plus the
  connect card. A deliberate, temporary cost, so the connect ask lands at the moment of
  intent.
