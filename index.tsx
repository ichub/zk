import * as React from "react";
import ReactDOM from "react-dom";
import { testExample, fibonacciCircuit } from "./exampleZk";
import { Circuit, Input } from "./zk";

const App = () => {
  return (
    <div>
      <CircuitDisplay circuit={fibonacciCircuit} />
    </div>
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
    <div>
      this is this circuit: <br />
      <pre>{circuit.evaluate.toString()}</pre>
      <br />
      and these are its inputs: <br />
      {circuit.inputs.map((input, i) => (
        <InputDisplay key={i} input={input} />
      ))}
    </div>
  );
};

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
