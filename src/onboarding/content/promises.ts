import { CompanionTraits } from "@apptypes";

export interface PromiseOption {
  id: string;
  line: string;
  /** Internal-only trait lean applied once when chosen. Never shown to the child. */
  traitLean: Partial<CompanionTraits>;
}

/**
 * First Promise options. Framed as a meaningful choice between the
 * child and their Companion, not a tutorial checkbox — see master
 * protocol §NAMING.
 */
export const firstPromiseOptions: PromiseOption[] = [
  {
    id: "promise-explore",
    line: "We'll explore every corner of this world, together.",
    traitLean: { curiosity: 0.06, bond: 0.05 },
  },
  {
    id: "promise-brave",
    line: "We'll be brave, even on the wobbly days.",
    traitLean: { courage: 0.06, bond: 0.05 },
  },
  {
    id: "promise-kind",
    line: "We'll take care of each other, always.",
    traitLean: { heart: 0.06, bond: 0.05 },
  },
];
