import * as React from "react";
import ReactDOM from "react-dom";
import { testExample, fibonacciCircuit } from "./exampleZk";
import { Circuit } from "./zk";

const App = () => {
  return (
    <div>
      <CircuitDisplay circuit={fibonacciCircuit} />
    </div>
  );
};

const CircuitDisplay = ({ circuit }: { circuit: Circuit }) => {
  return (
    <div>
      this is this circuit: <br />
      <pre>{circuit.evaluate.toString()}</pre>
    </div>
  );
};

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
