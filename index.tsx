import * as React from "react";
import ReactDOM from "react-dom";
import { testExample, fibonacciCircuit } from "./exampleZk";
import { Circuit, Input, InputType } from "./zk";
import styled from "styled-components";

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
  return <Container>this is the trusted setup</Container>;
};

const Verifier = ({ circuit }: { circuit: Circuit }) => {
  return (
    <Container>
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
      this is this circuit: <br />
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
`;

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
