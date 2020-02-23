import * as React from "react";
import ReactDOM from "react-dom";
import { testExample } from "./exampleZk";

const App = () => {
  return (
    <div>
      <div>{testExample() + ""}</div>
    </div>
  );
};

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<App />, div);
