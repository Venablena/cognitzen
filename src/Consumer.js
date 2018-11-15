import React, { Component } from 'react';
import { GameContext } from './Provider';

class Consumer extends Component {

  render() {
    const { children } = this.props;

    return (
      <GameContext.Consumer>
        {({
          renderQualifiers,
          renderArg,
        }) => {
          return (
            <div className="App-wrapper">
              <h2>Identify elements of an argument</h2>
              <div className='qualifiers-container'>
                { renderQualifiers() }
              </div>
              <h2>Argument</h2>
              <div className="qualifiers-container">
                { renderArg() }
              </div>
            </div>
          );
        }}
      </GameContext.Consumer>
    );
  }

}

export default Consumer;
