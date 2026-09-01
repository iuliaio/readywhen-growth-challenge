"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppShell, Board } from "@/components/AppShell";
import { elapsedSince, track } from "@/lib/analytics";
import { isUnlocked, useSession } from "@/lib/session";

/** The board, once there is something to put on it. Locked until a source is
 *  connected — reaching it early means a deep link, so it bounces to chat. */
export default function InboxPage() {
  const router = useRouter();
  const { session, ready } = useSession();
  const unlocked = isUnlocked(session);

  useEffect(() => {
    if (!ready) return;
    if (!session.signedIn) router.replace("/signup");
    else if (!unlocked) router.replace("/chat");
  }, [ready, session.signedIn, unlocked, router]);

  const firstConnector = session.connected[0] ?? "none";
  const { flowVariant } = session;
  useEffect(() => {
    if (ready && session.signedIn && unlocked) {
      track("board.viewed", {
        firstConnector,
        variant: flowVariant,
        timeSinceSignup: elapsedSince("signup:done"),
      });
    }
  }, [ready, session.signedIn, unlocked, firstConnector, flowVariant]);

  if (!ready || !session.signedIn || !unlocked) return null;

  return (
    <AppShell>
      <Board />
    </AppShell>
  );
}
