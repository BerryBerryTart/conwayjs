import React from "react";
import "./App.less";
import Canvas from "./Canvas";
import { MouseContextProvider } from "./MouseContext";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Canvas />
      </div>
    );
  }
}

export default App;
