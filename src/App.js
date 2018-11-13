import React, { Component, Fragment } from 'react';
import Game from './components/Game';
import Round2 from './components/Round2';
//import Data from './data-1.json';
import './App.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        {/* <Game args={Data}/> */}
        <Round2 />
      </Fragment>
    );
  }
}

export default App;
