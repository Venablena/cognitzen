import React, { Component } from 'react';
import Game from './Game';
import Data from '../data-2.json';
import Contention from './Contention';

class Round2 extends Component {
  state = {
    title: Data.content,
    contentions: Data.contentions,
    currentCase: Data.contentions[1],
    solvedCases: [],
  };

  render() {
    const {
      title,
      contentions,
      currentCase
    } = this.state;

    const args = currentCase.arguments[1]

    return (
      <div className="">
        <div className="game-container">
          <h2>{ title }</h2>
          <h3>{ currentCase.content }</h3>
          {
            <Game
              currentArg={ args.parts }
            />
          }
        </div>
        <div className="contentions-container">
          { Object.keys(contentions).map((key, idx) => {
            const cases = contentions[key];
            return (
              <Contention
                key={idx}
                title={cases.content}
                solvedArgs={[]}
              />
            )
          })}
        </div>
      </div>
    );
  }

}

export default Round2;
