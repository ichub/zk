export type VerifierKey = string;
export type ProvingKey = string;
export type ToxicWaste = string;
export type Proof = string;

export type Evaluator = (circuit: Circuit, inputValues: string[]) => void;

export class Circuit {
  public readonly inputs: Input[];
  public readonly evaluate: Evaluator;

  public constructor(inputs: Input[], evaluate: Evaluator) {
    this.inputs = inputs;
    this.evaluate = evaluate;
  }
}

export function trustedSetup(
  trueRandomness: string
): {
  provingKey: ProvingKey;
  verifierKey: VerifierKey;
  toxicWaste: ToxicWaste;
} {
  return {
    provingKey: "adfg" + trueRandomness,
    verifierKey: "asdf2" + trueRandomness,
    toxicWaste: "this is toxic waste"
  };
}

export function verify(
  publicInputs: PublicInput[],
  values: string[],
  proof: Proof
) {}

export function generateProof(
  circuit: Circuit,
  provingKey: ProvingKey,
  publicInputValues: string[],
  privateInputValues: string[]
): Proof {
  return Math.random() + "";
}

export type PublicInput = { name: string; type: InputType.Public };
export type PrivateInput = { name: string; type: InputType.Private };
export type Input = PublicInput | PrivateInput;

export enum InputType {
  Public,
  Private
}
