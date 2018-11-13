import React, { Component } from 'react';
import Game from './Game';
import Data from '../data-2.json';

class Round2 extends Component {
  state = {

  };

  render() {
    console.log(Data);
    return (
      <div className="App-wrapper">
        <h2>{ Data.content }</h2>
      </div>
    );
  }

}

export default Round2;
