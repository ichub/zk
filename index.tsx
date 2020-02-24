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
import Highlight from "react-highlight";

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
    <AppContainer>
      <GlobalStyle />

      <ContentContainer>
        <Title>JSSnark</Title>
        <TrustedSetup />
        <CircuitDisplay circuit={fibonacciCircuit} />
        <GenerateProof circuit={fibonacciCircuit} />
        <Verifier circuit={fibonacciCircuit} />
      </ContentContainer>
    </AppContainer>
  );
};

const TrustedSetup = () => {
  const [setupValues, setSetupValues] = useState(null);

  async function setup() {
    setSetupValues(await trustedSetup(Math.random() + ""));
  }

  return (
    <Container>
      <h2>trusted setup</h2>
      <input type="button" value="do the setup" onClick={setup} /> <br /> <br />
      {setupValues && (
        <div>
          proving key: <Label>{setupValues.provingKey} </Label>
          <br />
          verifier key: <Label>{setupValues.verifierKey} </Label>
          <br />
          toxic waste: <Label>{setupValues.toxicWaste} </Label>
          <br />
        </div>
      )}
    </Container>
  );
};

const GenerateProof = ({ circuit }: { circuit: Circuit }) => {
  const provingKeyRef = createRef<HTMLTextAreaElement>();
  const inputRefs = circuit.inputs.map(() => createRef<HTMLTextAreaElement>());

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
      <h2>proof generator</h2>
      circuit: <Label>(circuit displayed above)</Label> <br />
      <InputLabel>proving key:</InputLabel> <Input ref={provingKeyRef} /> <br />
      {circuit.inputs.map((input, i) => (
        <div key={i}>
          <InputLabel>{input.name}:</InputLabel> <Input ref={inputRefs[i]} />
        </div>
      ))}
      <br />
      <input type="button" value="generate proof" onClick={doProof} /> <br />
      {proof && (
        <div>
          <br /> <Proof>{proof}</Proof>
        </div>
      )}
    </Container>
  );
};

const Verifier = ({ circuit }: { circuit: Circuit }) => {
  const publicInputs = circuit.inputs.filter(i => i.type === InputType.Public);
  const inputRefs = publicInputs.map(() => createRef<HTMLTextAreaElement>());
  const proofRef = createRef<HTMLTextAreaElement>();
  const verifierKeyRef = createRef<HTMLTextAreaElement>();

  async function doTheVerification() {
    const values = publicInputs.map((input, i) => {
      return {
        ...input,
        value: inputRefs[i].current.value
      } as PublicInputWithValue;
    });

    const isSuccess = await verify(
      values,
      proofRef.current.value.trim(),
      verifierKeyRef.current.value
    );

    alert(isSuccess);
  }

  return (
    <Container>
      <h2>verifier</h2>
      <InputLabel>verifier key: </InputLabel> <Input ref={verifierKeyRef} />{" "}
      <br />
      <InputLabel>proof: </InputLabel>
      <Input ref={proofRef} /> <br />
      <br />
      {publicInputs.map((input, i) => {
        return (
          <span key={i}>
            <InputLabel>{input.name}:</InputLabel> <Input ref={inputRefs[i]} />
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
      <h2>circuit</h2>
      <Highlight className="javascript">
        {circuit.evaluate.toString()}
      </Highlight>
      <br />
      and these are its inputs: <br />
      {circuit.inputs.map((input, i) => (
        <InputDisplay key={i} input={input} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid grey;
  margin: 8px;
  padding: 8px;
  padding-top: 0;
  border-radius: 4px;
`;

const Label = styled.span`
  color: grey;
  display: inline-block;
  padding: 4px;
  font-size: 80%;
`;

const GlobalStyle = createGlobalStyle`
    body {
        font-family: monospace;
    }
`;

const Proof = styled.div`
  word-break: break-all;
  width: 100%;
  background-color: grey;
  padding: 8px;
  box-sizing: border-box;
`;

const Input = styled.textarea`
  width: 100%;
  height: 50px;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const InputLabel = styled.div`
  font-weight: bold;
`;

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 600px;
  margin-top: 32px;
  margin-bottom: 64px;
`;

const Title = styled.h1`
  width: 100%;
  text-align: center;
  margin-bottom: 32px;
  font-size: 3em;
`;

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
