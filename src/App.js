import React, { Component } from 'react';
import Provider from './Provider';
import Game from './components/Game';
import Modal from './components/Modal';
import Site from './components/Site';
import Data1 from './data-1.json';
import './App.css';

const args = Data1;
const unsolvedArgIds = Object.keys(args);

class App extends Component {
  render() {
    return (
      <Site>
        <Provider
          args={args}
          unsolvedArgIds={unsolvedArgIds}
          round="1"
        >
          <Game />
          <Modal />
        </Provider>
      </Site>
    );
  }
}

export default App;
