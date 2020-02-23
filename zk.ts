import { digestMessage } from "./utils";

export type VerifierKey = string;
export type ProvingKey = string;
export type ToxicWaste = string;
export type Proof = string;
export type InputValues = {};

export type PublicInput = { name: string; type: InputType.Public };
export type PrivateInput = { name: string; type: InputType.Private };

export type PublicInputWithValue = PublicInput & { value: string };
export type PrivateInputWithValue = PublicInput & { value: string };

export type Input = PublicInput | PrivateInput;
export type InputWithValue = PublicInputWithValue | PrivateInputWithValue;
export type Evaluator = (circuit: Circuit, inputValues: string[]) => void;

export class Circuit {
  public readonly inputs: Input[];
  public readonly evaluate: Evaluator;

  public constructor(inputs: Input[], evaluate: Evaluator) {
    this.inputs = inputs;
    this.evaluate = evaluate;
  }
}

export async function trustedSetup(
  trueRandomness: string
): Promise<{
  provingKey: ProvingKey;
  verifierKey: VerifierKey;
  toxicWaste: ToxicWaste;
}> {
  return {
    provingKey: await digestMessage("salt" + trueRandomness),
    verifierKey: await digestMessage("salt2" + trueRandomness),
    toxicWaste: await digestMessage("this is toxic waste" + trueRandomness)
  };
}

export function verify(publicInputs: PublicInputWithValue[], proof: Proof) {
  return true;
}

export function generateProof(
  circuit: Circuit,
  provingKey: ProvingKey,
  inputValues: InputWithValue[]
): Proof {
  return Math.random() + "";
}

export enum InputType {
  Public = "public",
  Private = "private"
}
