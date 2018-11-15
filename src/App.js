import React, { Component } from 'react';
import Provider from './Provider';
//import Consumer from './Consumer';
import Game from './components/Game';
import Round2 from './components/Round2';
import Data1 from './data-1.json';
//import Data2 from './data-2.json';
import './App.css';

class App extends Component {
  render() {
    return (
      //<Provider>
        <Round2 />
      //</Provider>
    );
  }
}

export default App;
{/*
  <Provider
    args={Data1}
    round="1"
  >
    <Game />
  </Provider>
*/}
