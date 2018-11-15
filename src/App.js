import React, { Component, Fragment } from 'react';
import Provider from './Provider';
//import Consumer from './Consumer';
import Game from './components/Game';
import Round2 from './components/Round2';
//import Data from './data-1.json';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider>
        {/*
          <Round2 />

          */}
          <Game
            // args={Data}
            //round="1"
          />
      </Provider>
    );
  }
}

export default App;
