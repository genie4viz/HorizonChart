import React, {Component} from 'react';
import HorizonGraph from './components/HorizonGraph';
import './App.css';

const data = [{
  "Acme1": {
    "total": 4000,
    "cat1": 500,
    "cat2": 600,
    "cat3": 400,
    "cat4": 2500
  }
}, {  
  "Acme2": {
    "total": 3500,
    "cat1": 600,
    "cat2": 900,
    "cat3": 500,
    "cat4": 1500
  }
}, {  
  "Acme3": {
    "total": 2000,
    "cat1": 500,
    "cat2": 500,
    "cat3": 400,
    "cat4": 600
  }
}, {  
  "Acme4": {
    "total": 3500,
    "cat1": 1500,
    "cat2": 400,
    "cat3": 600,
    "cat4": 1000
  }
}, {  
  "Acme5": {
    "total": 1500,
    "cat1": 500,
    "cat2": 500,
    "cat3": 400,
    "cat4": 100
  }
}];

const params = {
  "value": data,
  "categories": {
    "cat1" :"#609127",
    "cat2" :"#f6ce08",
    "cat3" :"#f68408",
    "cat4" :"#dc0000"
  },
  "dividerStyle":{
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "tooltipStyle":{
    "width": 80,
    "height": 50,
    "textMargin": 10
  }
};
class App extends Component {
  render() {
    return ( 
        <div className = "App" >          
          <HorizonGraph params={params} />
        </div>
    );
  }
}

export default App;