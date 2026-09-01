"use client";

import { useEffect, useState } from "react";

/**
 * A/B testing, cut down to what a demo can honestly do.
 *
 * There is no traffic splitting here. Nobody is going to run this repo at a
 * scale where splitting means anything, and a reviewer who got randomly bucketed
 * would only ever see one arm. So: everyone sees the control, and you switch arms
 * with a query parameter — `?onboarding-length=short`.
 *
 * `traffic` is what you would ship at. It is a decision you are recording, not
 * something this file enforces.
 *
 * It records nothing. An experiment you cannot measure is a coin flip, so wiring
 * up the exposure is part of the job.
 */
export interface Experiment {
  /** Stable name, and the query parameter that switches arms locally. */
  key: string;
  /** Arm names. The first one is the control. */
  variants: readonly string[];
  /** Share of traffic you would put into this, 0 to 1. */
  traffic: number;
}

/**
 * Chat-first onboarding. `control` is the funnel as Task 2 left it: sign up →
 * five welcome steps → chat. `chat-first` skips the welcome steps entirely,
 * drops the user straight into chat, and uses their first message as the moment
 * to ask for a source connection. Switch arms with `/signup?flow-shape=chat-first`.
 */
export const FLOW_SHAPE = {
  key: "flow-shape",
  variants: ["control", "chat-first"],
  traffic: 0.5,
} as const satisfies Experiment;

export type FlowVariant = (typeof FLOW_SHAPE)["variants"][number];

/** Register your experiments here. */
export const EXPERIMENTS: readonly Experiment[] = [FLOW_SHAPE];

/**
 * The arm to render. The control unless the URL names another one.
 *
 * Read after mount rather than during render: the first paint is the control
 * either way, and this keeps the component out of a Suspense boundary.
 */
export function useVariant(experiment: Experiment): string {
  const [variant, setVariant] = useState(experiment.variants[0]);

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get(
      experiment.key,
    );
    if (asked && experiment.variants.includes(asked)) setVariant(asked);
  }, [experiment]);

  return variant;
}
