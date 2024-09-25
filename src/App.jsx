import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import { MouseContextProvider } from "./MouseContext";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Canvas width={20} height={20} />
      </div>
    );
  }
}

export default App;
