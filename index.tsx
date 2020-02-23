import * as React from "react";
import ReactDOM from "react-dom";
import {
  Circuit,
  Input,
  InputType,
  generateProof,
  verify,
  trustedSetup,
  PublicInputWithValue
} from "./zk";
import styled from "styled-components";
import { useState, createRef } from "react";

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
      <GenerateProof circuit={fibonacciCircuit} />
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

const GenerateProof = ({ circuit }: { circuit: Circuit }) => {
  const [proof, setProof] = useState("");

  function doProof() {
    setProof(generateProof(circuit, "", []));
  }

  return (
    <Container>
      <h3>proof generator</h3>
      circuit: <Label>(circuit displayed above)</Label> <br />
      proving key: <input type="text" /> <br />
      {circuit.inputs.map((input, i) => (
        <span key={i}>
          {input.name}: <input type="text" />
        </span>
      ))}
      <br />
      <input type="button" value="generate proof" onClick={doProof} /> <br />
      proof: <Label>{proof}</Label>
    </Container>
  );
};

const Verifier = ({ circuit }: { circuit: Circuit }) => {
  const publicInputs = circuit.inputs.filter(i => i.type === InputType.Public);
  const inputRefs = publicInputs.map(() => createRef<HTMLInputElement>());
  const proofRef = createRef<HTMLInputElement>();
  const verifierKeyRef = createRef<HTMLInputElement>();

  function doTheVerification() {
    const values = publicInputs.map((input, i) => {
      return {
        ...input,
        value: inputRefs[i].current.value
      } as PublicInputWithValue;
    });

    const isSuccess = verify(values, proofRef.current.value);

    alert(isSuccess);
  }

  return (
    <Container>
      <h3>verifier</h3>
      verifier key: <input ref={verifierKeyRef} type="text" /> <br />
      proof: <input ref={proofRef} type="text" /> <br />
      these are the public inputs: <br />
      <br />
      {publicInputs.map((input, i) => {
        return (
          <span key={i}>
            {input.name}: <input ref={inputRefs[i]} type="text" />
          </span>
        );
      })}
      <br />
      <input type="button" value="verify" onClick={doTheVerification} />
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
  display: inline-block;
  width: 300px;
`;

const Label = styled.span`
  background-color: rgb(200, 200, 200);
  color: grey;
  border-radius: 4px;
  display: inline-block;
  padding: 4px;
  font-size: 80%;
`;

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
