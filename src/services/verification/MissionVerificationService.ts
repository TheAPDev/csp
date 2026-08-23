import { SubmissionType } from "@apptypes";

export type VerificationOutcome = "approved" | "retry";

export interface VerificationInput {
  missionId: string;
  submissionType: SubmissionType;
  /** Local file URI for photo/video submissions, when applicable. */
  mediaUri?: string;
}

export interface VerificationResult {
  outcome: VerificationOutcome;
  /**
   * Child-safe copy only. NEVER technical AI language ("AI confidence:
   * 93%", "model uncertain", etc.) — see master protocol §AI VERIFICATION.
   */
  companionLine: string;
}

/**
 * Independent of any UI. Batch 04 ships `MockMissionVerificationService`
 * for development; a later batch swaps in a real AI-backed
 * implementation behind this exact interface — no caller
 * (VerificationScreen) should need to change when that happens.
 */
export interface MissionVerificationService {
  verify(input: VerificationInput): Promise<VerificationResult>;
}

const APPROVE_LINES = [
  "Your Companion's eyes light up!",
  "Ooh — got it. Nicely done!",
  "Your Companion nods, delighted.",
  "That's exactly the kind of thing your Companion loves to see.",
];

const RETRY_LINES = [
  "Hmm, your Companion tilts its head — want to try once more?",
  "Your Companion isn't quite sure yet. One more try?",
  "So close! Your Companion thinks another go might do it.",
];

function pick(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock development verifier. Simulates the Companion "examining" the
 * submission for a short beat, then approves the large majority of
 * the time — a flaky mock shouldn't make a child feel punished
 * during development. Verification never feels like a school test:
 * no score is computed or shown, only an outcome + a Companion line.
 */
export class MockMissionVerificationService implements MissionVerificationService {
  async verify(_input: VerificationInput): Promise<VerificationResult> {
    await wait(1200 + Math.random() * 700);
    const approved = Math.random() < 0.85;
    return approved
      ? { outcome: "approved", companionLine: pick(APPROVE_LINES) }
      : { outcome: "retry", companionLine: pick(RETRY_LINES) };
  }
}

/** Single shared instance — swap this export's construction for a real backend later. */
export const missionVerificationService: MissionVerificationService = new MockMissionVerificationService();
