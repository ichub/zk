import { trustedSetup, Circuit, InputType, generateProof, verify } from "./zk";

// is this the 10th fibonacci number

const { provingKey, verifierKey, toxicWaste } = trustedSetup(
  "this is a random string"
);

export const fibonacciCircuit = new Circuit(
  [
    {
      name: "fibonacciNumber",
      type: InputType.Public
    }
  ],
  (circuit, inputValues) => {
    return true;
  }
);

const proof = generateProof(fibonacciCircuit, provingKey, [
  {
    name: "fibonacciNumber",
    type: InputType.Public,
    value: "test"
  }
]);

const isSuccess = verify(
  [
    {
      name: "fibonacciNumber",
      type: InputType.Public,
      value: "test"
    }
  ],
  proof
);

export function testExample() {
  return isSuccess;
}
