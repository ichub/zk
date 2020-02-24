import { digestMessage } from "./utils";

const base64Encode = true;

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
export type Evaluator = (inputValues: InputWithValue[]) => void;

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
  let encodedProofValues: any;

  if (base64Encode) {
    proof = atob(proof);
  }

  try {
    encodedProofValues = JSON.parse(proof);
  } catch {
    return false;
  }

  for (let i = 0; i < publicInputs.length; i++) {
    let actualValue = encodedProofValues.inputValues.find(
      val => val.name === publicInputs[i].name
    );

    actualValue.value = publicInputs[i].value;
  }

  const func = encodedProofValues.circuit.evaluate;

  const evaluated = `(${func})(${JSON.stringify(
    encodedProofValues.inputValues
  )})`;

  console.log(evaluated);

  let success = false;

  try {
    success = eval(evaluated);
  } catch {}

  return success;
}

export function generateProof(
  circuit: Circuit,
  provingKey: ProvingKey,
  inputValues: InputWithValue[]
): Proof {
  const obj = {
    circuit: { ...circuit, evaluate: circuit.evaluate.toString() },
    provingKey,
    inputValues
  };

  if (base64Encode) {
    return btoa(JSON.stringify(obj));
  } else {
    return JSON.stringify(obj);
  }
}

export enum InputType {
  Public = "public",
  Private = "private"
}
