import * as React from "react";
import ReactDOM from "react-dom";
import {
  Circuit,
  Input,
  InputType,
  generateProof,
  verify,
  trustedSetup,
  PublicInputWithValue,
  InputWithValue
} from "./zk";
import styled, { createGlobalStyle } from "styled-components";
import { useState, createRef } from "react";

export const fibonacciCircuit = new Circuit(
  [
    {
      name: "fibonacciNumber",
      type: InputType.Private
    },
    {
      name: "n",
      type: InputType.Public
    }
  ],
  inputValues => {
    function fibonacci(num: number) {
      var a = 1,
        b = 0,
        temp;

      while (num > 0) {
        temp = a;
        a = a + b;
        b = temp;
        num--;
      }

      return b;
    }

    const fibonacciNumber = parseInt(
      inputValues.find(i => i.name === "fibonacciNumber").value
    );
    const n = parseInt(inputValues.find(i => i.name === "n").value);

    console.log("testing: ", fibonacciNumber, n);
    console.log("expected", fibonacci(n));

    return fibonacci(n) === fibonacciNumber;
  }
);

const App = () => {
  return (
    <>
      <GlobalStyle />
      <TrustedSetup />
      <CircuitDisplay circuit={fibonacciCircuit} />
      <GenerateProof circuit={fibonacciCircuit} />
      <Verifier circuit={fibonacciCircuit} />
    </>
  );
};

const TrustedSetup = () => {
  const [setupValues, setSetupValues] = useState({
    provingKey: "",
    verifierKey: "",
    toxicWaste: ""
  });

  async function setup() {
    setSetupValues(await trustedSetup(Math.random() + ""));
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
  const provingKeyRef = createRef<HTMLInputElement>();
  const inputRefs = circuit.inputs.map(() => createRef<HTMLInputElement>());

  const [proof, setProof] = useState("");

  function doProof() {
    const values = inputRefs.map(ref => ref.current.value);
    const valuesWithDefinitions = circuit.inputs.map((input, i) => {
      return {
        ...input,
        value: values[i]
      };
    }) as InputWithValue[];

    setProof(
      generateProof(circuit, provingKeyRef.current.value, valuesWithDefinitions)
    );
  }

  return (
    <Container>
      <h3>proof generator</h3>
      circuit: <Label>(circuit displayed above)</Label> <br />
      proving key: <input ref={provingKeyRef} type="text" /> <br />
      {circuit.inputs.map((input, i) => (
        <div key={i}>
          {input.name}: <input ref={inputRefs[i]} type="text" />
        </div>
      ))}
      <br />
      <input type="button" value="generate proof" onClick={doProof} /> <br />
      proof: <WordWrap>{proof}</WordWrap>
    </Container>
  );
};

const Verifier = ({ circuit }: { circuit: Circuit }) => {
  const publicInputs = circuit.inputs.filter(i => i.type === InputType.Public);
  const inputRefs = publicInputs.map(() => createRef<HTMLTextAreaElement>());
  const proofRef = createRef<HTMLTextAreaElement>();
  const verifierKeyRef = createRef<HTMLTextAreaElement>();

  function doTheVerification() {
    const values = publicInputs.map((input, i) => {
      return {
        ...input,
        value: inputRefs[i].current.value
      } as PublicInputWithValue;
    });

    const isSuccess = verify(values, proofRef.current.value.trim());

    alert(isSuccess);
  }

  return (
    <Container>
      <h3>verifier</h3>
      verifier key: <textarea ref={verifierKeyRef} /> <br />
      proof: <textarea ref={proofRef} /> <br />
      these are the public inputs: <br />
      <br />
      {publicInputs.map((input, i) => {
        return (
          <span key={i}>
            {input.name}: <textarea ref={inputRefs[i]} />
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
        <b>{input.type}</b> {input.name}
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
  font-size: 80%;
`;

const GlobalStyle = createGlobalStyle`
    body {
        font-family: monospace;
    }
`;

const WordWrap = styled.div`
  word-break: break-all;
  width: 100%;
  background-color: grey;
`;

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
