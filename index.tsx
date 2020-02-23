import * as React from "react";
import ReactDOM from "react-dom";
import {
  Circuit,
  Input,
  InputType,
  generateProof,
  verify,
  trustedSetup
} from "./zk";
import styled from "styled-components";
import { useState } from "react";

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

// const proof = generateProof(fibonacciCircuit, provingKey, [
//   {
//     name: "fibonacciNumber",
//     type: InputType.Public,
//     value: "test"
//   }
// ]);

// const isSuccess = verify(
//   [
//     {
//       name: "fibonacciNumber",
//       type: InputType.Public,
//       value: "test"
//     }
//   ],
//   proof
// );

const App = () => {
  return (
    <div>
      <TrustedSetup />
      <CircuitDisplay circuit={fibonacciCircuit} />
      <Verifier circuit={fibonacciCircuit} />
    </div>
  );
};

const TrustedSetup = () => {
  const [setupValues, setSetupValues] = useState({
    provingKey: "",
    verifierKey: "",
    toxicWaste: ""
  });

  function setup() {
    setSetupValues(trustedSetup("randomness"));
  }

  return (
    <Container>
      <h3>trusted setup</h3>
      <input type="button" value="do the setup" onClick={setup} /> <br /> <br />
      proving key: <Label>{setupValues.provingKey} </Label>
      <br />
      verifier key: <Label>{setupValues.verifierKey} </Label>
      <br />
      toxic waste: <Label>{setupValues.toxicWaste} </Label>
      <br />
    </Container>
  );
};

const Verifier = ({ circuit }: { circuit: Circuit }) => {
  return (
    <Container>
      <h3>verifier</h3>
      verifier key: <input type="text" /> <br />
      proof: <input type="text" /> <br />
      these are the public inputs: <br />
      <br />
      {circuit.inputs
        .filter(i => i.type === InputType.Public)
        .map((input, i) => {
          return (
            <span key={i}>
              {input.name}: <input type="text" />
            </span>
          );
        })}
    </Container>
  );
};

const InputDisplay = ({ input }: { input: Input }) => {
  return (
    <div>
      <pre>
        {input.type} {input.name}
      </pre>
    </div>
  );
};

const CircuitDisplay = ({ circuit }: { circuit: Circuit }) => {
  return (
    <Container>
      <h3>circuit</h3>
      <pre>{circuit.evaluate.toString()}</pre>
      <br />
      and these are its inputs: <br />
      {circuit.inputs.map((input, i) => (
        <InputDisplay key={i} input={input} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid black;
  margin: 8px;
  padding: 8px;
  padding-top: 0;
`;

const Label = styled.span`
  background-color: rgb(200, 200, 200);
  color: grey;
  border-radius: 4px;
  display: inline-block;
  padding: 4px;
`;

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
