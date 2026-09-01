"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { elapsedSince, restartClock, startClock, track } from "@/lib/analytics";
import { SOCIAL_PROVIDERS } from "@/lib/content";
import { FLOW_SHAPE, type FlowVariant } from "@/lib/experiments";
import { useSession } from "@/lib/session";

const DEMO_EMAIL = "you@acme.com";

/**
 * Resolved straight from the URL, not via `useVariant`: this decides which page
 * the user is sent to, so it can't tolerate `useVariant`'s one-render flash to
 * "control" before the param is read.
 */
function resolveFlowVariant(): FlowVariant {
  const asked = new URLSearchParams(window.location.search).get(FLOW_SHAPE.key);
  return asked === "chat-first" ? "chat-first" : "control";
}

/**
 * One form behind two doors, same as the product: /signup and /login render
 * identically and both accept anyone. The route only exists so the funnel can
 * tell which one the visitor meant, which is unknowable on a shared URL.
 */
export function AuthScreen({
  intent,
}: Readonly<{ intent: "login" | "signup" }>) {
  const router = useRouter();
  const { update } = useSession();
  const [email, setEmail] = useState("");

  useEffect(() => {
    startClock("signup:landed");
  }, []);

  function signIn(provider: string, address: string) {
    const variant = resolveFlowVariant();
    update({ signedIn: true, provider, email: address, flowVariant: variant });
    track("signup.completed", {
      provider,
      authIntent: intent,
      timeOnScreen: elapsedSince("signup:landed"),
    });
    track("experiment.flow_shape_exposed", { variant });
    restartClock("signup:done");
    router.push(variant === "chat-first" ? "/chat" : "/welcome");
  }

  const other = intent === "signup" ? "login" : "signup";

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-8 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <Image
          src="/logos/readywhen-lockup-on-light.webp"
          alt="readywhen"
          translate="no"
          width={188}
          height={32}
          style={{ height: "auto" }}
          priority
          className="notranslate self-center"
        />

        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h1 className="text-center text-base font-semibold">
            {intent === "login" ? "Welcome back" : "Create your account"}
          </h1>

          {SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              size="lg"
              onClick={() => signIn(provider.id, DEMO_EMAIL)}
              className="w-full justify-start"
            >
              <img
                src={provider.iconSrc}
                alt=""
                className="size-4 object-contain"
              />
              {provider.label}
            </Button>
          ))}

          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" aria-hidden />
            or
            <span className="bg-border h-px flex-1" aria-hidden />
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              signIn("email", email.trim() || DEMO_EMAIL);
            }}
          >
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              aria-label="Work email"
            />
            <Button type="submit" size="lg" className="w-full">
              Continue with email
            </Button>
          </form>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          {intent === "signup" ? "Already have an account? " : "New here? "}
          <Link href={`/${other}`} className="underline underline-offset-2">
            {other === "login" ? "Sign in" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
