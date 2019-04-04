import React, { Component } from 'react';
import GaugeGraph from './components/GaugeGraph';
import './App.css';

const params = [
  {
      "Value": "B+",
      "ValueStyle": {
          "Margin": 10,
          "TextSize": 80
      },
      "HexStyle": {
          "Margin": 10,
          "Radius": 20
      },
      "startColor": "red",
      "endColor": "green",
      "fillerColor": "#041e44",
      "endAngle": 120,
      "startAngle": 0,
      "arc_w": 17,
      "arc_h": 10
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <GaugeGraph params={params[0]}/>        
      </div>
    );
  }
}

export default App;
