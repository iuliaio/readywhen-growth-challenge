import { recordBusinessEvent, type BusinessEventTags } from "./metrics";

type AuthIntent = "login" | "signup";
type OnboardingStep = "org" | "profile" | "explainer" | "tools" | "slips";

export type TimeSpan =
  | "<2s"
  | "2-10s"
  | "10-30s"
  | "30-120s"
  | ">2m"
  | "unknown";

export type CountRange = "1" | "2-3" | "4-5" | "6+";

type NoTags = Record<string, never>;

export type FunnelEvents = {
  "signup.headline_viewed": { headlineVariant: string; authIntent: AuthIntent };
  "signup.completed": {
    provider: string;
    headlineVariant: string;
    authIntent: AuthIntent;
    timeOnScreen: TimeSpan;
  };
  "onboarding.step_viewed": { step: OnboardingStep };
  "onboarding.step_completed": { step: OnboardingStep; timeOnStep: TimeSpan };
  "onboarding.step_left": {
    step: OnboardingStep;
    direction: "back";
    timeOnStep: TimeSpan;
  };
  "connector.picker_viewed": NoTags;
  "connector.selected": { connector: string; timeToChoose: TimeSpan };
  "connector.declined": { connector: string; timeOnConsentScreen: TimeSpan };
  "connector.connected": {
    connector: string;
    timeOnConsentScreen: TimeSpan;
    timeSinceSignup: TimeSpan;
  };
  "chat.message_sent": { messageNumber: CountRange; firstConnector: string };
  "chat.commitments_viewed": NoTags;
  "chat.draft_viewed": NoTags;
  "chat.draft_sent": NoTags;
  "board.viewed": { firstConnector: string; timeSinceSignup: TimeSpan };
};

export function track<K extends keyof FunnelEvents>(
  event: K,
  tags: FunnelEvents[K],
): void {
  recordBusinessEvent(event, tags as BusinessEventTags);
}

export function toCountRange(count: number): CountRange {
  if (count <= 1) return "1";
  if (count === 2 || count === 3) return "2-3";
  if (count <= 5) return "4-5";
  return "6+";
}

const clocks: Record<string, number> = {};

export function startClock(name: string): void {
  clocks[name] ??= Date.now();
}

export function restartClock(name: string): void {
  clocks[name] = Date.now();
}

export function elapsedSince(name: string): TimeSpan {
  const startedAt = clocks[name];
  if (startedAt === undefined) return "unknown";
  const ms = Date.now() - startedAt;
  if (ms < 2_000) return "<2s";
  if (ms < 10_000) return "2-10s";
  if (ms < 30_000) return "10-30s";
  if (ms < 120_000) return "30-120s";
  return ">2m";
}
