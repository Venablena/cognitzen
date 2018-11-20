import React, { Component } from 'react';
import Game from './Game';
import Data from '../data-2.json';
import Contention from './Contention';
import Provider from '../Provider';

class Round2 extends Component {
  state = {
    contentionTitle: Data.content,
    contentions: Data.contentions,
    currentCase: Data.contentions[1],
    solvedCases: [],
  };

  getCurrentArgs = () => {
    const { currentCase } = this.state;
    return Object.keys(currentCase.arguments).map((key, idx) => {
      return currentCase.arguments[key].parts
    })
  }

  render() {
    const {
      contentionTitle,
      contentions,
      currentCase
    } = this.state;

    const args = this.getCurrentArgs();

    return (
      <Provider
        args={args}
        round= "2"
      >
        <div className="">
          <div className="game-container">
            <h2>{ contentionTitle }</h2>
            <h3>{ currentCase.content }</h3>
            { <Game /> }
          </div>
          <div className="contentions-container">
            { Object.keys(contentions).map((key, idx) => {
              const cases = contentions[key];
              return (
                <Contention
                  key={idx}
                  contentionTitle={cases.content}
                  solvedArgIds={[]}
                />
              )
            })}
          </div>
        </div>
      </Provider>
    );
  }

}

export default Round2;
