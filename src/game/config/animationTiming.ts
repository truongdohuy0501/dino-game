/** Toddler-friendly pacing — increase if animations still feel too fast. */
export const ANIM_TIMING = {
  /** Idle ↔ blink frame swap */
  idleFrameMs: 1400,
  /** Each eat animation frame */
  eatFrameMs: 550,
  /** How long happy face stays on screen */
  happyHoldMs: 1200,
  /** Dino hop on celebrate */
  celebrateHopMs: 280,
} as const
