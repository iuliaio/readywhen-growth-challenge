"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { elapsedSince, restartClock, startClock, track } from "@/lib/analytics";
import { SOCIAL_PROVIDERS } from "@/lib/content";
import { SIGNUP_HEADLINE, useVariant } from "@/lib/experiments";
import { useSession } from "@/lib/session";

const DEMO_EMAIL = "you@acme.com";

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
  const headline = useVariant(SIGNUP_HEADLINE);

  useEffect(() => {
    startClock("signup:landed");
    const asked = new URLSearchParams(window.location.search).get(
      SIGNUP_HEADLINE.key,
    );
    const shown =
      asked && SIGNUP_HEADLINE.variants.includes(asked)
        ? asked
        : SIGNUP_HEADLINE.variants[0];
    track("signup.headline_viewed", {
      headlineVariant: shown,
      authIntent: intent,
    });
  }, [intent]);

  function signIn(provider: string, address: string) {
    update({ signedIn: true, provider, email: address });
    track("signup.completed", {
      provider,
      headlineVariant: headline,
      authIntent: intent,
      timeOnScreen: elapsedSince("signup:landed"),
    });
    restartClock("signup:done");
    router.push("/welcome");
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
            {intent === "login"
              ? "Welcome back"
              : headline === "direct"
                ? "Start catching what you said you'd do"
                : "Create your account"}
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
