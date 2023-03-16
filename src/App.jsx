import React from 'react';
import './App.css';
import Canvas from './Canvas';

class App extends React.Component {
    render(){
        return (
            <div className="App">
                <Canvas width={70} height={40} />
            </div>
        );
    }
}

export default App;
