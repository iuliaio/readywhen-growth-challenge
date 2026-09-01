"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { AppShell, OnboardingCard } from "@/components/AppShell";
import { ConsentDialog } from "@/components/ConsentDialog";
import { elapsedSince, restartClock, track } from "@/lib/analytics";
import { type Tool } from "@/lib/content";
import { useSession } from "@/lib/session";
import { ConnectStep, ExplainerStep, OrgNameStep, ProfileStep, SlipsStep } from "./steps";

const STEPS = ["org", "profile", "explainer", "tools", "slips"] as const;
type Step = (typeof STEPS)[number];

/**
 * The whole pre-board flow, as the product runs it: one surface, one frosted card
 * over the live board, five steps that never change the backdrop.
 */
export default function WelcomePage() {
  const router = useRouter();
  const { session, ready, update } = useSession();
  const [step, setStep] = useState<Step>("org");
  const [pendingConnect, setPendingConnect] = useState<Tool | null>(null);

  useEffect(() => {
    if (ready && !session.signedIn) router.replace("/signup");
  }, [ready, session.signedIn, router]);

  useEffect(() => {
    restartClock(`step:${step}`);
    track("onboarding.step_viewed", { step });
    if (step === "tools") {
      restartClock("connector:picker");
      track("connector.picker_viewed", { source: "welcome" });
    }
  }, [step]);

  if (!ready || !session.signedIn) return null;

  const stepIndex = STEPS.indexOf(step);

  const next = () => {
    track("onboarding.step_completed", { step, timeOnStep: elapsedSince(`step:${step}`) });
    setStep(STEPS[stepIndex + 1]);
  };
  const back = () => {
    track("onboarding.step_left", {
      step,
      direction: "back",
      timeOnStep: elapsedSince(`step:${step}`),
    });
    setStep(STEPS[stepIndex - 1]);
  };

  return (
    <>
      <AppShell decorative />
      <OnboardingCard>
        <Image
          src="/logos/readywhen-lockup-on-light.webp"
          alt="readywhen"
          translate="no"
          className="notranslate"
          width={132}
          height={22}
          style={{ height: "auto" }}
          priority
        />

        {step === "org" && (
          <OrgNameStep
            domain={session.email?.split("@")[1] ?? null}
            onContinue={(orgName) => {
              update({ orgName });
              next();
            }}
          />
        )}

        {step === "profile" && (
          <ProfileStep
            onContinue={(values) => {
              update(values);
              next();
            }}
          />
        )}

        {step === "explainer" && <ExplainerStep onContinue={next} />}

        {step === "tools" && (
          <ConnectStep
            connected={session.connected}
            onPick={(tool) => {
              track("connector.selected", {
                connector: tool.slug,
                source: "welcome",
                timeToChoose: elapsedSince("connector:picker"),
              });
              restartClock("connector:consent");
              setPendingConnect(tool);
            }}
            onContinue={next}
            onBack={back}
          />
        )}

        {step === "slips" && (
          <SlipsStep
            selected={session.jtbd}
            onSelect={(jtbd) => update({ jtbd })}
            detail={session.jtbdDetail}
            onDetailChange={(jtbdDetail) => update({ jtbdDetail })}
            onContinue={() => {
              track("onboarding.step_completed", {
                step: "slips",
                timeOnStep: elapsedSince("step:slips"),
              });
              router.push("/chat");
            }}
            onBack={back}
          />
        )}
      </OnboardingCard>

      {pendingConnect && (
        <ConsentDialog
          tool={pendingConnect}
          onCancel={() => {
            track("connector.declined", {
              connector: pendingConnect.slug,
              source: "welcome",
              timeOnConsentScreen: elapsedSince("connector:consent"),
            });
            setPendingConnect(null);
          }}
          onAllow={() => {
            update({ connected: [...session.connected, pendingConnect.slug] });
            track("connector.connected", {
              connector: pendingConnect.slug,
              source: "welcome",
              timeOnConsentScreen: elapsedSince("connector:consent"),
              timeSinceSignup: elapsedSince("signup:done"),
            });
            setPendingConnect(null);
          }}
        />
      )}
    </>
  );
}
