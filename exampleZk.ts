import { trustedSetup, Circuit, InputType } from "./zk";

// is this the 10th fibonacci number

const { provingKey, verifierKey, toxicWaste } = trustedSetup(
  "this is a random string"
);

const circuit = new Circuit(
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
